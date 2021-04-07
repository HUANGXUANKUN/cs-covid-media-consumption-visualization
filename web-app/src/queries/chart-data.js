import CHART_DATA_LOADER from '../data/chart'

/**
 * Helper function to retrieve country chart data
 * @param {keyof typeof import('../data/chart').default} countryCode
 */
export const getCountryChartData = (countryCode) => {
    const loader = CHART_DATA_LOADER[countryCode]
    return loader
        .load()
        .then((data) => data.default)
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            return []
        })
}
