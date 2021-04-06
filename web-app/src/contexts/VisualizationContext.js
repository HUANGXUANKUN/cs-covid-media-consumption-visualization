import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import { getAvailableRegionCodes } from '../queries/region'

const configuration = {
    defaultRegion: 'global',
    availableRegions: [],
}

const VisualizationContext = React.createContext({
    state: {
        selectedRegion: configuration.defaultRegion,
        availableRegions: configuration.availableRegions,
    },
    dispatch: () => {},
})

export const ACTIONS = {
    SET_REGION: 'SET_REGION',
    SET_AVAILABLE_REGION: 'SET_AVAILABLE_REGION',
}

const initialState = {
    selectedRegion: configuration.defaultRegion,
    availableRegions: configuration.availableRegions,
}

const visualizationReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_REGION:
            return { ...state, selectedRegion: action.data }
        case ACTIONS.SET_AVAILABLE_REGION:
            return { ...state, availableRegions: action.data }
        default:
            throw new Error()
    }
}

export const VisualizationContextWrapper = ({ children }) => {
    const [state, dispatch] = useReducer(visualizationReducer, initialState)
    const store = React.useMemo(() => ({ state, dispatch }), [state])

    useEffect(() => {
        dispatch({
            type: ACTIONS.SET_AVAILABLE_REGION,
            data: getAvailableRegionCodes(),
        })
    }, [])

    return (
        <VisualizationContext.Provider value={store}>
            {children}
        </VisualizationContext.Provider>
    )
}

VisualizationContextWrapper.propTypes = {
    children: PropTypes.node.isRequired,
}

export default VisualizationContext
