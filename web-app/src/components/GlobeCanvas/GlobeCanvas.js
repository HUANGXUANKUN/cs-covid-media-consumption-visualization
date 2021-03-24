/* eslint-disable react/jsx-boolean-value */
import React from 'react'
import { Canvas } from 'react-three-fiber'
import { ReactComponent as CircleLine } from './circle-line.svg'
import CameraControls from './CameraControls'
import config from './config'
import Globe from './Globe'
import './GlobeCanvas.css'

const GlobeCanvas = () => (
    <div className='globe'>
        <div className='svg-wrapper'>
            <CircleLine />
        </div>
        <Canvas className='globe-canvas'>
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
                    opacity={0.5}
                    color='#16222A'
                    transparent
                />
            </mesh>
            <Globe />
        </Canvas>
    </div>
)

export default GlobeCanvas
