import CHART_DATA_LOADER from '../data/chart'

const CHART_DATA_MEMO = {}

/**
 * Helper function to retrieve country chart data
 * @param {keyof typeof import('../data/chart').default} countryCode
 */
export const getCountryChartData = (countryCode) => {
    if (CHART_DATA_MEMO[countryCode]) {
        return Promise.resolve(CHART_DATA_MEMO[countryCode])
    }
    const loader = CHART_DATA_LOADER[countryCode]
    return loader
        .load()
        .then((data) => {
            CHART_DATA_MEMO[countryCode] = data
            return data
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            return []
        })
}
