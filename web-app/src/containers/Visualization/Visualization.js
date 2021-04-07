import React, { useContext, useLayoutEffect } from 'react'
import AudioFeatures from './AudioFeatures'
import CaseTrends from './CaseTrends'
import { TimerContext } from '../../contexts'

/**
 * Visualization container
 */
const Visualization = () => {
    const timerContext = useContext(TimerContext)

    useLayoutEffect(() => {
        timerContext.startTimer()
    }, [])

    return (
        <div className='flex flex-col justify-start items-center h-full pl-4 pr-4'>
            <CaseTrends />
            <div className='overflow-y-auto overflow-x-hidden h-auto w-full'>
                <AudioFeatures />
            </div>
        </div>
    )
}

export default Visualization
