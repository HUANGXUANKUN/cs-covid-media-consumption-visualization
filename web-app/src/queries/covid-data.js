import REGION_CODE_MAP from '../data/covid/metadata/region-code-map.json'

/**
 * Helper function to load relevant covid data
 * @param {'confirmed' | 'death' | 'recovered'} type
 */
export const loadCovidData = (type) => {
    switch (type) {
        case 'confirmed':
            return import('../data/covid/global-confirmed.json')
        case 'death':
            return import('../data/covid/global-death.json')
        case 'recovered':
            return import('../data/covid/global-recovered.json')
        default:
            throw new Error()
    }
}

/**
 * Helper function to convert country code to covid data key
 * @param {keyof typeof import('../data/chart').default} countryCode
 */
export const convertRegionCodeToCovidCountryKey = (countryCode) => {
    if (countryCode === 'global') return countryCode
    return Object.entries(REGION_CODE_MAP).find(
        (entry) => entry[1].code === countryCode
    )[0]
}

/**
 * Helper function to return country specific covid data
 * @param {keyof typeof import('../data/chart').default} countryCode
 * @param {'confirmed' | 'death' | 'recovered'} type
 */
export const loadCovidCountryData = async (countryCode, type) => {
    const key = convertRegionCodeToCovidCountryKey(countryCode)
    const data = await loadCovidData(type)
    if (key === 'global') {
        const countryKeys = Object.keys(data).filter(
            (dataKey) => !['date', 'default'].includes(dataKey)
        )
        let sumArray
        countryKeys.forEach((countryKey) => {
            const numbers = data[countryKey].series.map((number) => +number)
            if (!sumArray) sumArray = numbers
            else {
                numbers.forEach((number, index) => {
                    sumArray[index] += number
                })
            }
        })
        return data.date.map((date, index) => ({
            date,
            confirmed: sumArray[index],
        }))
    }
    return data.date.map((date, index) => ({
        date,
        confirmed: data[key].series.map((number) => Number(number))[index],
    }))
}
