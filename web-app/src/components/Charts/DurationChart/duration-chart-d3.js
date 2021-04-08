import * as d3 from 'd3'
import * as lodash from 'lodash'

export default function DurationChart(
    data,
    width = 900,
    height = 300,
    margin = { top: 20, right: 60, bottom: 150, left: 60 },
    histHeight = height / 3,
    chartHeight = (height / 3) * 2,
    containerClassName = 'duration-chart',
    containerTag = 'div'
) {
    const plotWidth = width - margin.left - margin.right
    const parseDate = d3.timeParse('%Y-%m-%d-%H')

    const formatMonth = (date) =>
        date.getMonth() === 0 ? date.getFullYear() : d3.timeFormat('%b')(date)

    const generateDaily = (dataset) => {
        const result = []
        let sum = 0
        let prevDate = dataset[0].date
        for (let i = 0; i < dataset.length; i += 1) {
            if (dataset[i].date === prevDate) {
                sum +=
                    (dataset[i].duration * dataset[i].streams_count) / 3600000
            } else {
                result.push({ date: parseDate(`${prevDate}-0`), duration: sum })
                sum = 0
                prevDate = dataset[i].date
            }
        }
        return result
    }

    const generateMonth = (dataset) => {
        const result = []
        let weekCount = 0
        let sum = 0
        let curMonth = dataset[0].date
        for (let i = 0; i < dataset.length; i += 1) {
            if (curMonth.getMonth() !== dataset[i].date.getMonth()) {
                curMonth = dataset[i].date
                weekCount = 0
            }

            if (dataset[i].date.getDay() !== 6) {
                sum += dataset[i].duration
            } else {
                result.push({ duration: sum, week: weekCount, date: curMonth })
                sum = 0
                weekCount += 1
            }
        }
        return result
    }

    const dailyData = generateDaily(
        lodash.sortBy(data, (o) => new Date(o.date))
    )
    const monthData = generateMonth(dailyData)

    const weekScale = d3.scaleLinear().domain([0, 4]).range([0, chartHeight])
    const rScale = d3
        .scaleLinear()
        .domain([
            d3.min(monthData, (d) => d.duration),
            d3.max(monthData, (d) => d.duration),
        ])
        .range([3, chartHeight / 12])

    const x = d3
        .scaleTime()
        .domain([
            d3.min(dailyData, (d) => d.date),
            d3.max(dailyData, (d) => d.date),
        ])
        .range([0, plotWidth])
        .clamp(true)

    const y = d3
        .scaleLinear()
        .domain([
            d3.min(dailyData, (d) => d.duration),
            d3.max(dailyData, (d) => d.duration),
        ])
        .range([histHeight, 0])

    const colorMaps = [
        '#2c7bb6',
        '#00a6ca',
        '#00ccbc',
        '#90eb9d',
        '#ffff8c',
        '#f9d057',
        '#f29e2e',
        '#e76818',
        '#d7191c',
    ]
    const colors = d3
        .scaleQuantize()
        .domain([
            d3.min(dailyData, (d) => d.duration),
            d3.max(dailyData, (d) => d.duration),
        ])
        .range(colorMaps)

    const dailyYAxis = d3
        .axisLeft(y)
        .ticks(5)
        .tickSizeOuter(0)
        .tickFormat((d) => d3.format('.2s')(d))
    const weeklyYAxis = d3
        .axisLeft(weekScale)
        .ticks(4)
        .tickFormat((d) => `Week ${d + 1}`)

    const node = document.createElement(containerTag)
    node.setAttribute('class', containerClassName)

    d3.select(node).select('svg').remove()

    const svg = d3
        .select(node)
        .append('svg')
        .attr('width', plotWidth + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    const hist = svg
        .append('g')
        .attr('class', 'histogram')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const slider = svg
        .append('g')
        .attr('class', 'slider')
        .attr(
            'transform',
            `translate(${margin.left}, ${margin.top + histHeight})`
        )

    const plot = svg
        .append('g')
        .attr('class', 'plot')
        .attr(
            'transform',
            `translate(${margin.left}, ${margin.top + histHeight + 50})`
        )

    svg.append('g')
        .attr('transform', `translate(${margin.left - 20}, ${margin.top})`)
        .call(dailyYAxis)

    const weeklyYAxisNode = svg
        .append('g')
        .attr(
            'transform',
            `translate(${margin.left - 10}, ${margin.top + histHeight + 50})`
        )
        .call(weeklyYAxis)

    weeklyYAxisNode.selectChildren('.domain').remove()
    weeklyYAxisNode.selectChildren('.tick').selectChildren('line').remove()

    // Histogram
    hist.selectAll('.rectbar')
        .data(dailyData)
        .enter()
        .append('g')
        .append('rect')
        .attr('class', 'rectbar')
        .style('fill', (d) => colors(d.duration))
        .attr('x', (d) => x(d.date))
        .attr('width', plotWidth / 730)
        .attr('y', (d) => y(d.duration))
        .attr('height', (d) => histHeight - y(d.duration))
        .style('transition', '1s')

    // Dot plot
    const drawDotPlot = (dataset) => {
        const weeklyDots = plot
            .selectAll('.weeklyDots')
            .data(dataset, (d) => d.duration)

        weeklyDots.exit().remove()

        weeklyDots
            .enter()
            .append('circle')
            .attr('class', 'weeklyDots')
            .attr('cx', (d) => x(d.date))
            .attr('cy', (d) => weekScale(d.week))
            .attr('fill', (d) => colors(d.duration / 7))
            .attr('stroke', (d) => colors(d.duration / 7))
            .attr('opacity', 0.8)
            .attr('r', (d) => rScale(d.duration))
            .style('transition', '1s')

        weeklyDots.exit().remove()
    }

    drawDotPlot(monthData)

    // Slider
    slider
        .append('rect')
        .attr('class', 'drag-bar')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', plotWidth)
        .attr('height', 10)
        .attr('fill', '#dcdcdc')
        .attr('rx', 4)
        .attr('ry', 4)

    slider
        .append('g', '.track-overlay')
        .attr('class', 'ticks')
        .attr('transform', 'translate(0, 18)')
        .style('pointer-events', 'stroke')
        .style('stroke-width', '50px')
        .style('stroke', 'transparent')
        .style('cursor', 'crosshair')
        .selectAll('text')
        .data(x.ticks(24))
        .enter()
        .append('text')
        .attr('x', x)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .text((d) => formatMonth(d))
        .style('font-size', '10px')

    const handle = slider
        .append('circle', '.track-overlay')
        .attr('class', 'handle')
        .attr('r', 9)
        .attr('cy', 5)
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-opacity', '0.5')
        .style('stroke-width', '1.25px')

    slider
        .append('rect')
        .attr('class', 'drag-layer')
        .attr('x', 0)
        .attr('y', -35)
        .attr('width', plotWidth)
        .attr('height', 70)
        .attr('fill', 'transparent')
        .style('cursor', 'crosshair')

    // Legend
    const legend = svg
        .append('g')
        .attr(
            'transform',
            `translate(${margin.left + plotWidth / 2 - 150}, ${
                margin.top + histHeight + chartHeight + 100
            })`
        )
    const defs = legend.append('defs')
    const linearGradient = defs
        .append('linearGradient')
        .attr('id', 'linear-gradient')

    linearGradient
        .selectAll('stop')
        .data(colors.range())
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (colors.range().length - 1))
        .attr('stop-color', (d) => d)

    legend
        .append('rect')
        .attr('width', 300)
        .attr('height', 20)
        .style('fill', 'url(#linear-gradient)')

    legend
        .append('text')
        .text('Less Streaming')
        .attr('dy', 40)
        .attr('dx', -30)
        .style('font-size', '11px')
        .style('fill', '#2b2b2b')

    legend
        .append('text')
        .text('More Streaming')
        .attr('dy', 40)
        .attr('dx', 260)
        .style('font-size', '11px')
        .style('fill', '#2b2b2b')

    return {
        node,
        updateByDate(date) {
            handle.attr('cx', x(date))
            d3.selectAll('.rectbar').attr('style', (d) =>
                d.date < date
                    ? `fill: ${colors(d.duration)}; transition: 1s;`
                    : 'fill: #eaeaea; transition: 1s;'
            )
            d3.selectAll('.weeklyDots').attr('style', (d) =>
                d.date <= date
                    ? `fill: ${colors(d.duration / 7)}; stroke: ${colors(
                          d.duration / 7
                      )}; transition: 1s;`
                    : 'fill: #eaeaea; stroke: none; transition: 1s;'
            )
        },
    }
}
