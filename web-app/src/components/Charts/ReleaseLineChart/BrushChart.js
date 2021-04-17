import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    extent,
    select,
    scaleLinear,
    line,
    curveCardinal,
    axisBottom,
    axisLeft,
    brushX,
    timeFormat,
    scaleTime,
} from 'd3'
import useResizeObserver from './useResizeObserver'
import usePrevious from './usePrevious'

/**
 * A brush chart component
 */
const BrushChart = ({ data, children, startDate, endDate }) => {
    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)
    const [selection, setSelection] = useState([startDate, endDate])
    const previousSelection = usePrevious(selection)

    useEffect(() => {
        const svg = select(svgRef.current)
        const { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect()

        const margin = 20
        svg.attr('transform', `translate(0, ${margin})`)

        const keys = [
            'in1Month',
            'in3Month',
            'in6Month',
            'in1Year',
            'beyond1Year',
        ]
        let xMax = 0
        data.forEach((d) => {
            xMax = Math.max(xMax, d.totalCount)
        })

        let xMin = 100
        data.forEach((d) => {
            xMin = Math.min(xMin, d.totalCount)
        })

        const newReleaseSelector = 'totalCount'
        const xScale = scaleTime()
            .domain(extent(data, (d) => d.date))
            .range([margin, width - margin])

        const yScale = scaleLinear().domain([xMin, xMax]).range([height, 0])

        const lineGenerator = line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d[newReleaseSelector]))
            .curve(curveCardinal)

        svg.select('circle')
            .attr('r', 4)
            .attr('stroke', '#eb5050')
            .attr('fill', 'white')
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .style('transition', '1s')

        svg.selectAll('.myLine')
            .data([data])
            .join('path')
            .attr('class', 'myLine')
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .attr('d', lineGenerator)

        svg.selectAll('.myDot')
            .data(data)
            .join('circle')
            .attr('class', 'myDot')
            .attr('stroke', 'none')
            .attr('r', (value) =>
                value.date >= selection[0] && value.date <= selection[1] ? 6 : 3
            )
            .attr('fill', (value) =>
                value.date >= selection[0] && value.date <= selection[1]
                    ? 'rgba(5, 150, 105)'
                    : '#a5a5a5'
            )
            .attr('cx', (value) => xScale(value.date))
            .attr('cy', (value) => yScale(value[newReleaseSelector]))
            .style('transition', '1s')
            .on('mouseleave', () => {
                svg.selectAll('.main-tooltip-area-text').remove()
                svg.selectAll('.brush-tooltip').remove()
            })
            .on('mouseenter', (event, value) => {
                svg.selectAll('.main-tooltip-area-text').remove()
                const index = svg
                    .selectAll('.myDot')
                    .nodes()
                    .indexOf(event.target)
                if (index !== -1 && index !== 0) {
                    svg.selectAll('.brush-tooltip')
                        .data([value])
                        .join((enter) =>
                            enter
                                .append('text')
                                .attr(
                                    'y',
                                    yScale(value[newReleaseSelector]) - 4
                                )
                        )
                        .attr('class', 'main-tooltip-area-text')
                        .text(
                            `W${value.weekNumber}: ${value[newReleaseSelector]}`
                        )
                        .attr('x', xScale(value.date))
                        .attr('text-anchor', 'middle')
                        .attr('y', yScale(value[newReleaseSelector]) - 8)
                        .attr('opacity', 1)
                } else {
                    svg.selectAll('.brush-tooltip').remove()
                }
            })

        const formatMonth = (date) =>
            date.getMonth() === 0 ? date.getFullYear() : timeFormat('%b')(date)
        const xAxis = axisBottom(xScale)
            .tickFormat(formatMonth)
            .tickSizeOuter(0)
            .tickSize(0)

        svg.select('.x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)

        const yAxis = axisLeft(yScale).tickSizeOuter(0)
        svg.select('.y-axis')
            .attr('transform', `translate(${margin}, 0)`)
            .call(yAxis)

        svg.select('.unit').remove()
        svg.append('text')
            .attr('class', 'unit')
            .attr('text-anchor', 'end')
            .style('font-size', '10px')
            .attr('x', margin + 90)
            .attr('y', margin - 10)
            .text('Number of Songs')

        const brush = brushX()
            .extent([
                [0, 0],
                [width, height],
            ])
            .on('start brush end', (event) => {
                if (
                    event.selection &&
                    !event.selection.some((d) => Number.isNaN(d))
                ) {
                    const indexSelection = event.selection.map(xScale.invert)
                    setSelection(indexSelection)
                }
            })

        if (previousSelection === selection) {
            svg.select('.brush')
                .call(brush)
                .call(brush.move, selection.map(xScale))
                .selectChild('.selection')
                .attr('fill', 'rgba(154, 165, 182)')
                .attr('fill-opacity', '0.3')
                .attr('transform', 'translate(0, -1)')
        }
    }, [data, dimensions, previousSelection, selection])

    return (
        <>
            <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
                <svg className='release-chart-svg' ref={svgRef}>
                    <g className='x-axis' />
                    <g className='y-axis' />
                    <g className='brush' />
                    <g className='main-brush-tooltip-area'></g>
                </svg>
            </div>
            {children({ selection })}
        </>
    )
}

BrushChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.func,
    startDate: PropTypes.objectOf(Date),
    endDate: PropTypes.objectOf(Date),
}

export default BrushChart
