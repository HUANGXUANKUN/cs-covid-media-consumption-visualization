import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import CalendarHeatMap from '../../components/Charts/CalendarHeatMap'
import RadarChart from '../../components/Charts/RadarChart'
import { TimerContext, VisualizationContext } from '../../contexts'
import {
    getAudioFeatureYoYChangeSeries,
    getWeightedAudioFeaturesComparison,
} from '../../queries/audio-features'

/**
 * Visualization container
 */
const Visualization = () => {
    const timerContext = useContext(TimerContext)
    const visualizationContext = useContext(VisualizationContext)
    const [data, setData] = useState([])
    const [currData, yearBeforeData] = data
    const [heatMapData, setHeatMapData] = useState({})

    useLayoutEffect(() => {
        timerContext.startTimer()
    }, [])

    useEffect(() => {
        getAudioFeatureYoYChangeSeries(
            visualizationContext.state.selectedRegion,
            'valence'
        ).then(setHeatMapData)
    }, [visualizationContext.state])

    useEffect(() => {
        getWeightedAudioFeaturesComparison(
            visualizationContext.state.selectedRegion,
            timerContext.currentDate
        ).then((features) => {
            setData(features)
        })
    }, [visualizationContext.state, timerContext.currentDate])

    return (
        <div className='bg-white p-6 rounded flex flex-col justify-center'>
            <CalendarHeatMap
                startDate={new Date(2020, 0, 1)}
                data={heatMapData}
                currentDate={timerContext.currentDate.toDate()}
            />
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
