import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

/**
 * Time picker component
 */
const TimePicker = ({ currentDate }) => (
    <span className='font-bold text-3xl'>
        {currentDate.format('YYYY-MM-DD')}
    </span>
)

TimePicker.propTypes = {
    currentDate: PropTypes.objectOf(moment),
}

export default TimePicker
