import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import CalendarHeatMap from '../../components/Charts/CalendarHeatMap'
import RadarChart from '../../components/Charts/RadarChart'
import TrendChart from '../../components/Charts/TrendChart'
import { TimerContext, VisualizationContext } from '../../contexts'
import {
    getAudioFeatureYoYChangeSeries,
    getWeightedAudioFeaturesComparison,
} from '../../queries/audio-features'
import { loadCovidCountryData } from '../../queries/covid-data'

/**
 * Visualization container
 */
const Visualization = () => {
    const timerContext = useContext(TimerContext)
    const visualizationContext = useContext(VisualizationContext)
    const [data, setData] = useState([])
    const [currData, yearBeforeData] = data
    const [heatMapData, setHeatMapData] = useState({})
    const [covidData, setCovidData] = useState([])
    const timeSeriesRef = useRef()

    useLayoutEffect(() => {
        timerContext.startTimer()
    }, [])

    useEffect(() => {
        getAudioFeatureYoYChangeSeries(
            visualizationContext.state.selectedRegion,
            'valence',
            true
        ).then(setHeatMapData)
        loadCovidCountryData(
            visualizationContext.state.selectedRegion,
            'confirmed'
        ).then(setCovidData)
    }, [visualizationContext.state.selectedRegion])

    useEffect(() => {
        getWeightedAudioFeaturesComparison(
            visualizationContext.state.selectedRegion,
            timerContext.currentDate
        ).then((features) => {
            setData(features)
        })
    }, [visualizationContext.state.selectedRegion, timerContext.currentDate])

    return (
        <>
            <div
                className='bg-white p-6 mb-3 rounded flex flex-col justify-center items-center relative full-width-child'
                ref={timeSeriesRef}
            >
                {timeSeriesRef.current && (
                    <TrendChart
                        data={covidData}
                        dateKey='date'
                        valueKey='confirmed'
                        className='h-32 w-full'
                        width={timeSeriesRef.current.clientWidth * 4}
                        startDate={new Date(2020, 0, 1)}
                        currDate={timerContext.currentDate.toDate()}
                    />
                )}
            </div>
            <div className='bg-white p-6 rounded flex flex-col justify-around items-center'>
                <CalendarHeatMap
                    startDate={new Date(2020, 0, 1)}
                    data={heatMapData}
                    currentDate={timerContext.currentDate.toDate()}
                    color='red'
                />
                {data.length > 0 && (
                    <div className='m-2 flex justify-around items-center h-auto w-full'>
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
        </>
    )
}

export default Visualization
