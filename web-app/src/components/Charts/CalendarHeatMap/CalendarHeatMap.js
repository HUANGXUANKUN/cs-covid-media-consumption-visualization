import React, { useEffect, useLayoutEffect, useRef } from 'react'
import * as CalHeatMap from 'cal-heatmap'
import PropTypes from 'prop-types'
import './CalendarHeatMap.css'

/**
 * Calendar heatmap component
 */
const CalendarHeatMap = ({ startDate, data, color, onClickDate }) => {
    const calRef = useRef()

    useEffect(() => {
        calRef.current.update(data)
    }, [data])

    useLayoutEffect(() => {
        const cal = new CalHeatMap()
        cal.init({
            itemSelector: '#calendar-heatmap',
            domain: 'month',
            cellSize: 9,
            start: startDate,
            range: 12,
            displayLegend: true,
            legendVerticalPosition: 'top',
            domainLabelFormat: '%b',
            subDomainTitleFormat: {
                empty: 'No negative change on {data}',
                filled: '{count}% change in feature on {date}',
            },
            considerMissingDataAsZero: true,
            legendColors: ['#e5e5e5', color],
            onClick(date) {
                onClickDate(date)
            },
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
    data: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired,
    onClickDate: PropTypes.func,
}

export default CalendarHeatMap
