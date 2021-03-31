import lodash from 'lodash'
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
 * @param {keyof typeof import('../data/country-name-map.json')} countryCode
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
