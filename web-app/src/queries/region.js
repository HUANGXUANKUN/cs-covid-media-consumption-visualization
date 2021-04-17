import * as lodash from 'lodash'
import CHART_DATA_LOADER from '../data/chart'
import REGION_CODE_MAP from '../data/chart/metadata/region-code-map.json'
import COVID_REGION_CODE_MAP from '../data/covid/metadata/region-code-map.json'

/**
 * Helper function to return available region codes
 */
export const getAvailableRegionCodes = () =>
    lodash.intersection(
        Object.keys(CHART_DATA_LOADER),
        Object.values(COVID_REGION_CODE_MAP).map(({ code }) => code)
    )

/**
 * Helper function to transform country code to full name
 * @param {keyof typeof import('../data/chart').default} countryCode
 */
export const transformCountryCodeToFullName = (countryCode) =>
    REGION_CODE_MAP[countryCode].name
