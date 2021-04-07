import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Component as RD3Component } from 'react-d3-library'

import createNode from './duration-chart-d3'

/**
 * D3.js duration chart component wrapped with React
 */
const DurationChart = ({
    data,
    margin,
    height,
    width,
    className,
    currDate,
}) => {
    const [node, setNode] = useState(null)

    useEffect(() => {
        const plotNode = createNode(
            data,
            width,
            height,
            margin,
            undefined,
            undefined,
            className
        )
        setNode(plotNode)
    }, [data, height, width])

    useEffect(() => {
        if (node) {
            node.updateByDate(currDate)
        }
    }, [node, currDate])

    return <RD3Component data={node === null ? null : node.node} />
}

DurationChart.propTypes = {
    /**
     * Input data for radar chart
     */
    data: PropTypes.arrayOf(PropTypes.object),
    /**
     * Class name to be assigned to SVG element
     */
    className: PropTypes.string,
    /**
     * Plot related specs
     */
    margin: PropTypes.shape({
        top: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number,
    }),
    height: PropTypes.number,
    width: PropTypes.number,
    currDate: PropTypes.objectOf(Date),
}

export default DurationChart
