import React, { useState, useEffect } from 'react'
import * as moment from 'moment'

const configuration = {
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2021, 0, 1),
    step: 1000 * 60 * 60 * 24,
    frequency: 4,
}

const TimerContext = React.createContext({
    currentDate: moment(configuration.startDate),
    setFrequency: () => {},
})

export const TimerContextWrapper = ({ children }) => {
    const [currDate, setCurrDate] = useState(moment(configuration.startDate))
    const [frequency, setFrequency] = useState(configuration.frequency)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrDate((prevDate) => {
                if (
                    prevDate.valueOf() + configuration.step <=
                    configuration.endDate.valueOf()
                ) {
                    return moment(prevDate.valueOf() + configuration.step)
                }
                return moment(prevDate.valueOf())
            })
        }, 1000 / frequency)
        return () => {
            clearInterval(timer)
        }
    }, [frequency])

    return (
        <TimerContext.Provider value={{ currentDate: currDate, setFrequency }}>
            {children}
        </TimerContext.Provider>
    )
}

export default TimerContext
