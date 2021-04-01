import React, { useRef } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import config from '../Globe/config'

extend({ OrbitControls })

/**
 * 3D orbit control component
 */
const CameraControls = () => {
    const {
        camera,
        gl: { domElement },
    } = useThree()
    const controls = useRef()

    useFrame(() => {
        controls.current.update()
    })

    camera.position.set(
        config.globeRadius * 1.5,
        config.globeRadius,
        config.globeRadius * 1
    )

    return (
        <orbitControls
            autoRotate
            autoRotateSpeed={0.25}
            ref={controls}
            args={[camera, domElement]}
            enableZoom={false}
        />
    )
}

export default CameraControls
