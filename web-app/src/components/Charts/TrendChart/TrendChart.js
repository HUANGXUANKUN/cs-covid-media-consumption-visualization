import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import { Component as RD3Component } from 'react-d3-library'

import createNode from './trend-chart-d3'

/**
 * D3.js trend chart component wrapped with React
 */
const TrendChart = ({
    data,
    dateKey,
    valueKey,
    colors,
    margin,
    height,
    width,
    className,
    svgClassName,
    startDate,
    endDate,
    currDate,
}) => {
    const [node, setNode] = useState(null)

    useEffect(() => {
        const plotNode = createNode(
            data.map((d) => ({ date: d[dateKey], value: d[valueKey] })),
            {
                h: height,
                w: width,
                margin,
                color: d3.scaleOrdinal(colors),
            },
            undefined,
            className,
            svgClassName,
            startDate,
            endDate
        )
        setNode(plotNode)
    }, [data, height, width])

    useEffect(() => {
        if (node) {
            node.clipPath.attr('width', node.timeScale(currDate))
        }
    }, [node, currDate])

    return <RD3Component data={node === null ? null : node.node} />
}

TrendChart.propTypes = {
    /**
     * Input data for radar chart
     */
    data: PropTypes.arrayOf(PropTypes.object),
    dateKey: PropTypes.string.isRequired,
    valueKey: PropTypes.string.isRequired,
    /**
     * Class name to be assigned to SVG element
     */
    className: PropTypes.string.isRequired,
    svgClassName: PropTypes.string.isRequired,
    /**
     * Plot related specs
     */
    colors: PropTypes.arrayOf(PropTypes.string),
    margin: PropTypes.shape({
        top: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number,
    }),
    height: PropTypes.number,
    width: PropTypes.number,
    startDate: PropTypes.objectOf(Date),
    endDate: PropTypes.objectOf(Date),
    currDate: PropTypes.objectOf(Date),
}

TrendChart.defaultProps = {
    colors: ['#00A0B0'],
    margin: 40,
    height: 500,
    width: 500,
}

export default TrendChart
