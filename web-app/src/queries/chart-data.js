const CHART_DATA_MEMO = {}

/**
 * Helper function to retrieve country chart data
 * @param {keyof typeof import('../data/country-name-map.json')} countryCode
 */
export const getCountryChartData = (countryCode) => {
    if (CHART_DATA_MEMO[countryCode]) {
        return Promise.resolve(CHART_DATA_MEMO[countryCode])
    }
    return import(`../data/chart-by-country/${countryCode}.json`)
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
