import React, { useRef } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import config from './config'

extend({ OrbitControls })

const CameraControls = () => {
    const {
        camera,
        gl: { domElement },
    } = useThree()
    const controls = useRef()
    useFrame(() => {
        controls.current.update()
    })
    camera.position.z = config.globeRadius * 2

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
