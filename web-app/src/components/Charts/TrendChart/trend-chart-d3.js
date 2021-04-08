import * as d3 from 'd3'

/**
 * Return a trend chart document node incorporated with D3.js plotting functionalities
 * @param {{ date: string, value: number }[]} entries Data entries
 * @param {{ w: number, h: number } | Record<string, string>} options Custom options for plotting
 * @param {string} tag HTML tag name, default as div
 * @param {string} className HTML class name default as trend-chart
 * @param {string} svgClassName SVG class name default as trend-chart
 */
export default function TrendChart(
    entries,
    options,
    tag = 'div',
    className = 'trend-chart',
    svgClassName = '',
    startDate = d3.min(entries, (d) => new Date(d.date)),
    endDate = d3.max(entries, (d) => new Date(d.date))
) {
    /**
     * Initialize configuration for plotting frame
     */

    // Default configuration parameters
    const defaultConfig = {
        w: 600, // Width of the circle
        h: 600, // Height of the circle
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the svg
        opacityArea: 0.35, // The opacity of the area of the blob
        strokeWidth: 2, // The width of the stroke around each blob
        roundStrokes: false, // If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.schemeCategory10, // Color function

        /**
         * Tailwind CSS related specs
         */
        legendClassName: 'font-bold uppercase inline-block text-base text-2xl',
        tooltipClassName: 'font-bold text-base',
        svgClassName,
    }

    // Update default configuration with custom plotting options
    if (typeof options !== 'undefined') {
        Object.entries(options).forEach(([key, value]) => {
            if (typeof options[key] !== 'undefined') {
                defaultConfig[key] = value
            }
        })
    }

    /**
     * Create the container SVG and g element
     * Document node is created as input for mounting as React component
     */

    // Create a document node
    const node = document.createElement(tag)
    node.setAttribute('class', className)

    // Remove whatever chart with the same id/class was present before
    d3.select(node).select('svg').remove()

    // Initiate the radar chart SVG
    const svg = d3
        .select(node)
        .append('svg')
        .attr(
            'width',
            defaultConfig.w +
                defaultConfig.margin.left +
                defaultConfig.margin.right
        )
        .attr(
            'height',
            defaultConfig.h +
                defaultConfig.margin.top +
                defaultConfig.margin.bottom
        )
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('class', `${className} ${defaultConfig.svgClassName}`)

    // Scale and path
    const timeScale = d3
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, defaultConfig.w - defaultConfig.margin.right])

    const valueScale = d3
        .scaleLinear()
        .domain(d3.extent(entries.map((entry) => entry.value)))
        .range([defaultConfig.h, 0])

    const areaPath = d3
        .area()
        .x((d) => timeScale(new Date(d.date)))
        .y0(valueScale.range()[0])
        .y1((d) => valueScale(d.value))
        .curve(d3.curveBasis)

    const linePath = d3
        .line()
        .x((d) => timeScale(new Date(d.date)))
        .y((d) => valueScale(d.value))
        .curve(d3.curveBasis)

    // Plots
    const clipPath = svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'selected-region')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', defaultConfig.h + defaultConfig.margin.top)
        .style('transition', '1s')

    const plot = svg
        .append('g')
        .attr(
            'transform',
            `translate(${defaultConfig.margin.left}, ${defaultConfig.margin.top})`
        )
    const basePlot = plot.append('g')
    const dynamicPlot = plot
        .append('g')
        .attr('clip-path', 'url(#selected-region)')

    basePlot
        .append('path')
        .datum(entries)
        .attr('d', areaPath)
        .attr('fill', 'rgba(154, 165, 182, 0.7)')
        .attr('fill-opacity', 0.4)
        .style('transition', '1s')

    basePlot
        .append('path')
        .datum(entries)
        .attr('d', linePath)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(154, 165, 182)')
        .attr('stroke-width', 1)
        .style('transition', '1s')

    dynamicPlot
        .append('path')
        .datum(entries)
        .attr('d', linePath)
        .attr('d', areaPath)
        .attr('fill', 'rgb(86, 98, 118)')
        .style('transition', '1s')

    dynamicPlot
        .append('path')
        .datum(entries)
        .attr('d', linePath)
        .attr('fill', 'none')
        .attr('stroke', 'rgb(101, 115, 139)')
        .attr('stroke-width', 2)
        .style('transition', '1s')

    // Axis

    const timeAxis = d3.axisBottom().scale(timeScale).tickSize(0)
    const valueAxis = d3
        .axisLeft()
        .scale(valueScale)
        .ticks(3)
        .tickFormat((d) => d3.format('.2s')(d))
        .tickSizeOuter(0)

    svg.append('g')
        .attr(
            'transform',
            `translate(${defaultConfig.margin.left}, ${
                defaultConfig.h + defaultConfig.margin.top
            })`
        )
        .call(timeAxis)
        .style('color', 'rgb(86, 98, 118)')
        .style('text-anchor', 'end')

    svg.append('g')
        .attr(
            'transform',
            `translate(${defaultConfig.w + 10}, ${defaultConfig.margin.top})`
        )
        .call(valueAxis)
        .style('color', 'rgb(86, 98, 118)')
        .style('text-anchor', 'end')

    return { node, clipPath, timeScale }
}
