/* eslint-disable react/jsx-boolean-value */
import React, { useContext } from 'react'
import { Canvas } from 'react-three-fiber'
import PropTypes from 'prop-types'
import { ReactComponent as CircleLine } from './circle-line.svg'
import CameraControls from '../../components/Globe/CameraControls'
import config from '../../components/Globe/Globe/config'
import Globe from '../../components/Globe/Globe'
import './GlobeCanvas.css'
import { VisualizationContext } from '../../contexts'
import { ACTIONS } from '../../contexts/VisualizationContext'

/**
 * Helper class to forward global context
 */
const ForwardCanvas = ({ children, className }) => {
    const store = useContext(VisualizationContext)
    return (
        <Canvas className={className}>
            <VisualizationContext.Provider value={store}>
                {children}
            </VisualizationContext.Provider>
        </Canvas>
    )
}

ForwardCanvas.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

/**
 * Global canvas class
 */
const GlobeCanvas = () => (
    <div className='globe'>
        <div className='svg-wrapper'>
            <CircleLine />
        </div>
        <ForwardCanvas className='globe-canvas'>
            <ambientLight />
            <CameraControls />
            <mesh>
                <sphereGeometry
                    args={[
                        config.globeRadius,
                        50,
                        50,
                        0,
                        Math.PI * 2,
                        0,
                        Math.PI * 2,
                    ]}
                />
                <meshLambertMaterial
                    opacity={0.25}
                    color='#26d0ce'
                    transparent
                />
            </mesh>
            <VisualizationContext.Consumer>
                {(context) => (
                    <Globe
                        onClickCountry={(event) =>
                            context.dispatch({
                                type: ACTIONS.SET_REGION,
                                data: event.country,
                            })
                        }
                        includeCountries={context.state.availableRegions}
                    />
                )}
            </VisualizationContext.Consumer>
        </ForwardCanvas>
    </div>
)

export default GlobeCanvas
