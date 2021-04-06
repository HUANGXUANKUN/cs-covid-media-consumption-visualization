import CHART_DATA_LOADER from '../data/chart'

/**
 * Helper function to return available region codes
 */
export const getAvailableRegionCodes = () => Object.keys(CHART_DATA_LOADER)
