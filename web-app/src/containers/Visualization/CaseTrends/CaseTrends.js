import React, { useContext, useEffect, useState } from 'react'
import { TimerContext, VisualizationContext } from '../../../contexts'
import { loadCovidCountryData } from '../../../queries/covid-data'
import VisualizationBox from '../../../components/VisualizationBox'
import TrendChart from '../../../components/Charts/TrendChart'
import { transformCountryCodeToFullName } from '../../../queries/region'
import TabGroup from '../../../components/TabGroup/TabGroup'

const DATA_TYPES = [
    { key: 'confirmed', name: 'Confirmed' },
    { key: 'recovered', name: 'Recovered' },
    { key: 'death', name: 'Death' },
]

export default () => {
    const timerContext = useContext(TimerContext)
    const visualizationContext = useContext(VisualizationContext)
    const [covidData, setCovidData] = useState([])
    const [selectedType, setSelectedType] = useState(DATA_TYPES[0])

    useEffect(() => {
        loadCovidCountryData(
            visualizationContext.state.selectedRegion,
            selectedType.key
        ).then(setCovidData)
    }, [visualizationContext.state.selectedRegion, selectedType])

    return (
        <VisualizationBox
            heading='h1'
            headingText={`${transformCountryCodeToFullName(
                visualizationContext.state.selectedRegion
            )} COVID-19 Time Series`}
            subtitle={`Chart below shows the yearly trend of COVID-19 cases in
                    ${transformCountryCodeToFullName(
                        visualizationContext.state.selectedRegion
                    )}. We use time-lapse animation to show the progression of the
                    pandemic, as a baseline for our visualization of Spotify
                    usage data to demonstrate the correlation between a specifc
                    query and how the disease evolved in a specific region.`}
            headingStyle='bg-yellow-600'
        >
            <TabGroup
                group={DATA_TYPES}
                selected={selectedType}
                onClick={setSelectedType}
            />
            <TrendChart
                data={covidData}
                dateKey='date'
                valueKey='confirmed'
                svgClassName='m-auto'
                width={window.innerWidth * 0.425}
                height={150}
                margin={{ left: 30, right: 20, top: 10, bottom: 20 }}
                startDate={new Date(2020, 0, 1)}
                currDate={timerContext.currentDate.toDate()}
            />
        </VisualizationBox>
    )
}
