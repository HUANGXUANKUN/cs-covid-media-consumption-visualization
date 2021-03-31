import React from 'react'

/**
 * Time picker component
 */
const TimePicker = ({ currentDate }) => (
    <div className='bg-white shadow rounded-sm p-2'>
        {currentDate.format('YYYY-MM-DD')}
    </div>
)

export default TimePicker
