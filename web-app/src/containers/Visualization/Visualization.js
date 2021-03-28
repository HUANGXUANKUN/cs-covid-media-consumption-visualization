import React, { useContext, useEffect, useState } from 'react'
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

    useEffect(() => {
        getWeightedAudioFeaturesComparison('jp', timerContext.currentDate).then(
            setData
        )
    }, [timerContext.currentDate])

    return (
        <div className='bg-white p-6 rounded flex flex-col justify-center'>
            {data.length && (
                <div className='flex justify-around items-center h-64'>
                    <RadarChart
                        round
                        level={4}
                        max={1}
                        margin={100}
                        data={[currData]}
                        colors={['#EDC951']}
                        className='h-64 inline-block'
                    />
                    <RadarChart
                        round
                        level={4}
                        max={1}
                        margin={100}
                        data={[yearBeforeData]}
                        colors={['#00A0B0']}
                        className='h-64 inline-block'
                    />
                </div>
            )}
            {timerContext.currentDate.format('YYYY-MM-DD')}
        </div>
    )
}

export default Visualization
