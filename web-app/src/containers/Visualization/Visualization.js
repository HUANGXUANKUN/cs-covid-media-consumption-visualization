import React, { useContext, useLayoutEffect } from 'react'
import AudioFeatures from './AudioFeatures'
import CaseTrends from './CaseTrends'
import { TimerContext, VisualizationContext } from '../../contexts'
import StreamDuration from './StreamDuration'
import Releases from './Releases'

// const LINKS = [
//     { link: '#audio-feature', name: 'Audio Features' },
//     { link: '#stream-duration', name: 'Stream Duration' },
//     { link: '#song-release', name: 'Releases' },
// ]

/**
 * Visualization container
 */
const Visualization = () => {
    const timerContext = useContext(TimerContext)
    const visualizationContext = useContext(VisualizationContext)

    useLayoutEffect(() => {
        timerContext.startTimer()
    }, [])

    return (
        <div className='flex flex-col justify-start items-center h-full pl-4 pr-4'>
            {visualizationContext.state.selectedRegion !== 'global' && (
                <div
                    role='button'
                    className='self-start font-medium hover:opacity-75 focus:outline-none'
                    onClick={() =>
                        visualizationContext.dispatch({
                            type: 'SET_REGION',
                            data: 'global',
                        })
                    }
                    onKeyPress={() => {}}
                    tabIndex={0}
                >
                    {'< Back to global data'}
                </div>
            )}
            <CaseTrends />
            {/* <div className='flex justify-around w-full mb-2 mt-2'>
                {LINKS.map((link) => (
                    <a
                        className='flex-1 mr-2 p-2 bg-gray-400 rounded-sm text-white text-center last:mr-0'
                        href={link.link}
                    >
                        {link.name}
                    </a>
                ))}
            </div> */}
            <div className='overflow-y-auto overflow-x-hidden h-auto w-full'>
                <AudioFeatures />
                <StreamDuration />
                <Releases />
            </div>
        </div>
    )
}

export default Visualization
