import lodash from 'lodash'
import { getCountryChartData } from './chart-data'

const AUDIO_FEATURES_TO_CALCULATE = [
    'danceability',
    'energy',
    // 'speechiness',
    'acousticness',
    // 'instrumentalness',
    'liveness',
    'valence',
]

/**
 * Helper function to retrieve daily weighted audio features for a given country
 * Sample output: { '2019-01-01': { valence: 0.5152 } }
 * @param {keyof typeof import('../data/country-name-map.json')} countryCode
 */
export const getDailyWeightedAudioFeatures = async (countryCode) => {
    const chartData = await getCountryChartData(countryCode)
    const chartDataDateGroup = lodash.groupBy(chartData, 'date')
    return lodash.mapValues(chartDataDateGroup, (group) =>
        AUDIO_FEATURES_TO_CALCULATE.reduce(
            (prev, curr) =>
                Object.assign(prev, {
                    [curr]: lodash.meanBy(group, `audio_features.${curr}`),
                }),
            {}
        )
    )
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
