import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import GLOBE_POINTS from './points.json'
import config from './config'

const DEFAULT_SCALE = 1

const convertFlatCoordsToSphereCoords = (latitude, longitude) => {
    const newLatitude =
        ((latitude - config.mapSize.width) / config.mapSize.width) * -180
    const newLongitude =
        ((longitude - config.mapSize.height) / config.mapSize.height) * -90

    const radius = Math.cos((newLongitude / 180) * Math.PI) * config.globeRadius
    const targetX = Math.cos((newLatitude / 180) * Math.PI) * radius
    const targetY =
        Math.sin((newLongitude / 180) * Math.PI) * config.globeRadius
    const targetZ = Math.sin((newLatitude / 180) * Math.PI) * radius

    return {
        x: targetX,
        y: targetY,
        z: targetZ,
    }
}

const Globe = () => {
    const tempObject = new THREE.Object3D()

    const ref = useRef()

    const positions = useMemo(
        () =>
            GLOBE_POINTS.points.map((point) => {
                const coordinates = convertFlatCoordsToSphereCoords(
                    point.x,
                    point.y
                )
                return coordinates
            }),
        [GLOBE_POINTS]
    )

    useFrame(() => {
        positions.forEach((position, index) => {
            tempObject.position.set(position.x, position.y, position.z)
            tempObject.scale.set(DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE)
            tempObject.updateMatrix()
            ref.current.setMatrixAt(index, tempObject.matrix)
        })
        ref.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={ref} args={[null, null, positions.length]}>
            <icosahedronBufferGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color='white' />
        </instancedMesh>
    )
}

export default Globe
