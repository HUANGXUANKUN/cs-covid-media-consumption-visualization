import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

const configuration = {
    defaultRegion: 'global',
}

const VisualizationContext = React.createContext({
    state: { selectedRegion: configuration.defaultRegion },
    dispatch: () => {},
})

export const ACTIONS = { SET_REGION: 'SET_REGION' }

const initialState = { selectedRegion: configuration.defaultRegion }

const visualizationReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_REGION:
            return { ...state, selectedRegion: action.data }
        default:
            throw new Error()
    }
}

export const VisualizationContextWrapper = ({ children }) => {
    const [state, dispatch] = useReducer(visualizationReducer, initialState)
    const store = React.useMemo(() => ({ state, dispatch }), [state])

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
