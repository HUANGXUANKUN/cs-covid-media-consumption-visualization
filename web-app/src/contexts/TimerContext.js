import React, { useState, useEffect, useCallback } from 'react'
import * as moment from 'moment'

const configuration = {
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2021, 0, 1),
    step: 1000 * 60 * 60 * 24,
    frequency: 1,
}

const TimerContext = React.createContext({
    currentDate: moment(configuration.startDate),
    setFrequency: () => {},
    startTimer: () => {},
})

export const TimerContextWrapper = ({ children }) => {
    const [currDate, setCurrDate] = useState(moment(configuration.startDate))
    const [frequency, setFrequency] = useState(configuration.frequency)
    const [timer, setTimer] = useState()

    const startTimer = useCallback(() => {
        const newTimer = setInterval(() => {
            setCurrDate((prevDate) => {
                if (
                    prevDate.valueOf() + configuration.step <=
                    configuration.endDate.valueOf()
                ) {
                    return moment(prevDate.valueOf() + configuration.step)
                }
                clearInterval(newTimer)
                return moment(prevDate.valueOf())
            })
        }, 1000 / frequency)
        setTimer(newTimer)
    }, [frequency])

    useEffect(() => () => clearInterval(timer), [timer])

    return (
        <TimerContext.Provider
            value={{ currentDate: currDate, setFrequency, startTimer }}
        >
            {children}
        </TimerContext.Provider>
    )
}

export default TimerContext
