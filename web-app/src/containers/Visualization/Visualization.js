import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import RadarChart from '../../components/Charts/RadarChart'
import { TimerContext } from '../../contexts'
import { getWeightedAudioFeaturesComparison } from '../../queries/audio-features'

/**
 * Visualization container
 */
const Visualization = () => {
    const timerContext = useContext(TimerContext)
    const [data, setData] = useState([])
    const [currData, yearBeforeData] = data

    useLayoutEffect(() => {
        timerContext.startTimer()
    }, [])

    useEffect(() => {
        getWeightedAudioFeaturesComparison('sg', timerContext.currentDate).then(
            (features) => {
                setData(features)
            }
        )
    }, [timerContext.currentDate])

    return (
        <div className='bg-white p-6 rounded flex flex-col justify-center'>
            {data.length > 0 && (
                <div className='flex justify-around items-center h-auto'>
                    <RadarChart
                        round
                        level={3}
                        max={1}
                        margin={100}
                        data={[currData]}
                        colors={['#EDC951']}
                        className='inline-block h-64'
                    />
                    <RadarChart
                        round
                        level={3}
                        max={1}
                        margin={100}
                        data={[yearBeforeData]}
                        colors={['#00A0B0']}
                        className='inline-block h-64'
                    />
                </div>
            )}
        </div>
    )
}

export default Visualization
