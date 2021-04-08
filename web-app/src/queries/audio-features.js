import lodash from 'lodash'
import moment from 'moment'
import { getCountryChartData } from './chart-data'

const AUDIO_FEATURES_TO_CALCULATE = [
    // 'instrumentalness',
    // 'liveness',
    'danceability',
    'energy',
    'acousticness',
    'speechiness',
    'valence',
]

/**
 * https://gist.github.com/stekhn/a12ed417e91f90ecec14bcfa4c2ae16a
 */
const weightedMean = (arrValues, arrWeights) => {
    const result = arrValues
        .map((value, i) => {
            const weight = arrWeights[i]
            const sum = value * weight

            return [sum, weight]
        })
        .reduce((p, c) => [p[0] + c[0], p[1] + c[1]], [0, 0])
    return result[0] / result[1]
}

/**
 * Helper function to retrieve daily weighted audio features for a given country
 * Sample output: { '2019-01-01': { valence: 0.5152 } }
 * @param {keyof typeof import('../data/chart/region-code-map.json')} countryCode
 */
export const getDailyWeightedAudioFeatures = async (countryCode) => {
    const chartData = await getCountryChartData(countryCode)
    const chartDataDateGroup = lodash.groupBy(chartData, 'date')
    return lodash.mapValues(chartDataDateGroup, (group) => {
        const streamCounts = lodash.map(group, 'streams_count')
        return AUDIO_FEATURES_TO_CALCULATE.reduce(
            (prev, curr) =>
                Object.assign(prev, {
                    [curr]: weightedMean(
                        lodash.map(group, `audio_features.${curr}`),
                        streamCounts
                    ),
                }),
            {}
        )
    })
}

/**
 * Helper function to retrieve YoY audio feature data for a given country
 * @param {keyof typeof import('../data/country-name-map.json')} countryCode
 * @param {import('moment').Moment} date
 */
export const getWeightedAudioFeaturesComparison = async (countryCode, date) => {
    const audioFeatures = await getDailyWeightedAudioFeatures(countryCode)
    const yearBeforeDate = date.clone().add(-1, 'year')
    return [date, yearBeforeDate]
        .map((d) => d.format('YYYY-MM-DD'))
        .map((key) => audioFeatures[key])
}

/**
 * Helper function to retrieve YoY change of a given audio feature
 * @param {keyof typeof import('../data/country-name-map.json')} countryCode
 * @param {'danceability' | 'energy' | 'acousticness' | 'speechiness' | 'valence'} featureName
 * @param {import('moment').Moment} startDate
 * @param {import('moment').Moment} endDate
 */
export const getAudioFeatureYoYChangeSeries = async (
    countryCode,
    featureName,
    reverse = false,
    startDate = moment(new Date(2020, 0, 1)),
    endDate = moment(new Date(2021, 0, 1))
) => {
    const series = {}
    const audioFeatures = await getDailyWeightedAudioFeatures(countryCode)
    for (let start = startDate.clone(); start <= endDate; ) {
        const dateYearBefore = start.clone().add(-1, 'year')
        const rawFeature = [start, dateYearBefore]
            .map((d) => d.format('YYYY-MM-DD'))
            .map((key) => audioFeatures[key])
            .map((data) => data[featureName])
        series[start.unix()] =
            ((rawFeature[0] - rawFeature[1]) / rawFeature[1]) *
            100 *
            (reverse ? -1 : 1)
        start.add(1, 'day')
    }
    return series
}
