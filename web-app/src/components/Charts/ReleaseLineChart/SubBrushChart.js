import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { select, scaleLinear, axisBottom, axisLeft, scaleTime } from 'd3'
import * as d3 from 'd3'
import useResizeObserver from './useResizeObserver'

/**
 * Renders a BrushChart
 */
function SubBrushChart({ data, selection, id = 'myClipPath' }) {
    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    useEffect(() => {
        const svg = select(svgRef.current)
        const content = svg.select('.content')
        const { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect()

        const margin = 20
        svg.attr('width', width + margin * 2)
            .attr('height', height)
            .attr('preserveAspectRatio', 'xMidYMid meet')

        const keys = [
            'in1Month',
            'in3Month',
            'in6Month',
            'in1Year',
            'beyond1Year',
        ]

        const keyMap = {
            in1Month: 'a month',
            in3Month: '1-3 months',
            in6Month: '3-6 months',
            in1Year: '6-12 month',
            beyond1Year: '1 year ago',
        }

        let yMax = 0
        data.forEach((d) => {
            yMax = Math.max(
                yMax,
                d[keys[0]] + d[keys[1]] + d[keys[2]] + d[keys[3]] + d[keys[4]]
            )
        })
        const selectedData = data
        const stackedData = d3.stack().keys(keys)(selectedData)
        const color = d3
            .scaleOrdinal([
                '#2c7bb6',
                '#00ccbc',
                '#90eb9d',
                '#f9d057',
                '#f29e2e',
            ])
            .domain(keys)
        const xScale = scaleTime()
            .domain(selection)
            .range([0, width - margin * 2])

        const yScale = scaleLinear()
            .domain([0, yMax])
            .range([height - 30, 0])

        const areaGenerator = d3
            .area()
            .x((d) => xScale(d.data.date))
            .y0((d) => yScale(d[0]))
            .y1((d) => yScale(d[1]))
            .curve(d3.curveBasis)

        content.selectAll('path').remove()
        const tooltip = d3
            .select('.brush-tooltip-area')
            .style('opacity', 0)
            .style('background', '#BCC5F7')

        const text = d3.select('.brush-tooltip-area-text').style('opacity', 1)
        const highlight = (event, d) => {
            d3.selectAll('.myArea').style('opacity', 0.1)
            d3.select(`.${d}`).style('opacity', 1)
        }
        const noHighlight = () => {
            d3.selectAll('.myArea').style('opacity', 1)
        }

        content
            .selectAll('.myLayers')
            .data(stackedData)
            .join('path')
            .attr('class', (d) => `myArea ${d.key}`)
            .style('fill', (d) => color(d.key))
            .attr('d', areaGenerator)
            .style('transition', '1s')
            .on('mouseover', (event, d) => {
                d3.selectAll('.myArea').style('opacity', 0.1)
                d3.select(`.${d.key}`).style('opacity', 1)
                tooltip.style('opacity', 1)
                text.text(`${keyMap[d.key]}`)
                tooltip.attr(
                    'transform',
                    `translate(${event.layerX + 10}, ${event.layerY})`
                )
            })
            .on('mouseleave', () => {
                d3.selectAll('.myArea').style('opacity', 1)
                tooltip.style('opacity', 0)
            })
            .on('mouseenter', () => {
                tooltip.style('opacity', 1)
            })

        const formatMonth = (date) => d3.timeFormat('%b %y')(date)
        const xAxis = axisBottom(xScale).tickFormat(formatMonth).tickSize(0)
        svg.select('.x-axis')
            .attr('transform', `translate(${margin}, ${height - 30})`)
            .transition()
            .duration(300)
            .call(xAxis)
        const yAxis = axisLeft(yScale).tickSizeOuter(0)
        svg.select('.y-axis')
            .attr('transform', `translate(${margin}, 0)`)
            .transition()
            .duration(300)
            .call(yAxis)

        svg.append('text')
            .attr('text-anchor', 'end')
            .style('font-size', '10px')
            .attr('x', margin + 90)
            .attr('y', margin - 10)
            .text('Number of Songs')

        svg.selectAll('.legend-rect').remove()
        svg.selectAll('.legend-text').remove()

        const size = 10
        const legendGroup = svg
            .append('g')
            .attr(
                'transform',
                `translate(${
                    width / 2 - ((keys.length - 1) * (size + 135)) / 2
                }, ${height})`
            )
        legendGroup
            .selectAll('myrect')
            .data(keys)
            .enter()
            .append('circle')
            .attr('class', 'legend-rect')
            .attr('cx', (d, i) => (size + 120) * i)
            .attr('r', size)
            .style('fill', (d) => color(d))
            .on('mouseover', highlight)
            .on('mouseleave', noHighlight)

        legendGroup
            .selectAll('mylabels')
            .data(keys)
            .enter()
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', (d, i) => (size + 120) * i + 15)
            .attr('y', size / 4)
            .style('fill', (d) => color(d))
            .text((d) => keyMap[d])
            .attr('text-anchor', 'left')
            .style('alignment-baseline', 'middle')
            .style('font-size', '12px')
            .on('mouseover', highlight)
            .on('mouseleave', noHighlight)

        d3.select(`#${id}`)
            .select('rect')
            .attr('width', width - margin * 2)
            .attr('height', height)
            .attr('x', margin)
            .attr('y', 0)
    }, [data, dimensions, JSON.stringify(selection)])

    return (
        <div className='release-graph-container'>
            <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
                <svg className='release-sub-chart-svg' ref={svgRef}>
                    <defs>
                        <clipPath id={id}>
                            <rect />
                        </clipPath>
                    </defs>
                    <g className='content' clipPath={`url(#${id})`} />
                    <g className='x-axis' />
                    <g className='y-axis' />
                    <g className='brush-tooltip-area'>
                        <text className='brush-tooltip-area-text'>default</text>
                    </g>
                </svg>
            </div>
        </div>
    )
}

SubBrushChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    selection: PropTypes.arrayOf(PropTypes.objectOf(Date)),
    id: PropTypes.string,
}

export default SubBrushChart
