import React, { useContext, useEffect, useState } from 'react'
import { TimerContext, VisualizationContext } from '../../../contexts'
import DurationChart from '../../../components/Charts/DurationChart'
import VisualizationBox from '../../../components/VisualizationBox'
import { getCountryChartData } from '../../../queries/chart-data'
import { transformCountryCodeToFullName } from '../../../queries/region'

export default () => {
    const timerContext = useContext(TimerContext)
    const visualizationContext = useContext(VisualizationContext)

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        getCountryChartData(visualizationContext.state.selectedRegion).then(
            setChartData
        )
    }, [visualizationContext.state.selectedRegion])

    return (
        <VisualizationBox
            heading='h1'
            headingText='Stream Duration Trend'
            subHeadingText='How much time is spent on streaming those top songs?'
            subtitle={
                <p>
                    The bar chart and bubble chart show the overall trend of
                    cumulative streaming duration in{' '}
                    {transformCountryCodeToFullName(
                        visualizationContext.state.selectedRegion
                    )}
                    . Color encoding is used to provide an intuitive view of how
                    active the listeners are in terms of cumulative streaming
                    duration over a given period, with colder colors meaning
                    less streaming count and warmer colors meaning more
                    streaming count.{' '}
                    <b>
                        A correlation between total streaming count and the
                        total COVID-19 cases could be observed for some regions.
                    </b>{' '}
                    A rise in COVID-19 cases may come with increasing streaming
                    duration or decreasing one, depending on the selected
                    country.
                </p>
            }
        >
            {chartData.length > 0 && (
                <DurationChart
                    data={chartData}
                    width={window.innerWidth * 0.6}
                    height={350}
                    currDate={timerContext.currentDate.toDate()}
                    className='overflow-x-auto'
                />
            )}
        </VisualizationBox>
    )
}
