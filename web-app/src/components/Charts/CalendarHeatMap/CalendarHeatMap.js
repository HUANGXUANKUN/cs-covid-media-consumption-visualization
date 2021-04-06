import React, { useEffect, useLayoutEffect, useRef } from 'react'
import * as CalHeatMap from 'cal-heatmap'
import PropTypes from 'prop-types'

/**
 * Calendar heatmap component
 */
const CalendarHeatMap = ({ startDate, currentDate, data, color }) => {
    const calRef = useRef()

    useEffect(() => {
        calRef.current.update(data)
    }, [data])

    useEffect(() => {
        calRef.current.highlight(currentDate)
    }, [currentDate])

    useLayoutEffect(() => {
        const cal = new CalHeatMap()
        cal.init({
            itemSelector: '#calendar-heatmap',
            domain: 'month',
            cellSize: 9,
            start: startDate,
            highlight: currentDate,
            range: 12,
            displayLegend: false,
            considerMissingDataAsZero: true,
            legendColors: ['#e5e5e5', color],
            data,
        })
        calRef.current = cal
    }, [])

    return (
        <div
            id='calendar-heatmap'
            className='overflow-x-auto m-2 max-w-full'
        ></div>
    )
}

CalendarHeatMap.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    currentDate: PropTypes.instanceOf(Date).isRequired,
    data: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired,
}

export default CalendarHeatMap
