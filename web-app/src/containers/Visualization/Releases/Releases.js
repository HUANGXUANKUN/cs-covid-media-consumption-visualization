import * as moment from 'moment'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { VisualizationContext } from '../../../contexts'
import VisualizationBox from '../../../components/VisualizationBox'
import { getWeeklyReleaseData } from '../../../queries/weekly-release'
import {
    BrushChart,
    SubBrushChart,
} from '../../../components/Charts/ReleaseLineChart'
import './Releases.css'
import { transformCountryCodeToFullName } from '../../../queries/region'

export default () => {
    const visualizationContext = useContext(VisualizationContext)
    const selectionRef = useRef()

    const [releaseData, setReleaseData] = useState([])
    const formatDateRange = (dateRange) =>
        dateRange.map((date) => moment(date).format('MMM D YYYY')).join(' - ')

    useEffect(() => {
        getWeeklyReleaseData(visualizationContext.state.selectedRegion).then(
            setReleaseData
        )
    }, [visualizationContext.state.selectedRegion])

    return (
        <VisualizationBox
            heading='h1'
            headingText='Song Release Analysis'
            headingId='song-release'
            subHeadingText='Did new songs appear more often, or did more old songs come back on chart?'
        >
            <VisualizationBox
                heading='h2'
                headingText='Trend of Songs Released/Back on Chart'
                subHeadingText='Expand or shrink the gray area to change the date range for song release breakdown'
                subtitle={`Chart above plots the count of songs that appeared on the top song chart in ${transformCountryCodeToFullName(
                    visualizationContext.state.selectedRegion
                )}, regardless of whether the song is new or already released a while ago. We calculated the trend from the start of 2019 to show the general trend pre and post the pandemic.`}
            >
                <BrushChart
                    data={releaseData}
                    startDate={new Date(2020, 0, 22)}
                    endDate={new Date(2020, 6, 22)}
                >
                    {({ selection }) => {
                        selectionRef.current = selection
                    }}
                </BrushChart>
            </VisualizationBox>
            {selectionRef.current && (
                <VisualizationBox
                    heading='h2'
                    headingText={`Breakdown of Songs on Chart, ${formatDateRange(
                        selectionRef.current
                    )}`}
                    subtitle={
                        <>
                            A breakdown of the songs that appear on the chart is
                            demonstrated by the dynamic graph above. A
                            noticeable trend of songs that were released more
                            than 1 year ago and appeared on the chart again from
                            the beginning of 2020 in some countries could{' '}
                            <b>
                                indicate a trend of nostalgia after the pandemic
                                hits
                            </b>
                            .
                        </>
                    }
                >
                    <SubBrushChart
                        data={releaseData}
                        selection={selectionRef.current}
                    />
                </VisualizationBox>
            )}
        </VisualizationBox>
    )
}
