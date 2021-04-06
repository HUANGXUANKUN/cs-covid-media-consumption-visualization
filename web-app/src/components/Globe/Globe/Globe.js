import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import PropTypes from 'prop-types'
import GLOBE_POINTS from './points.json'
import COUNTRY_POINTS from './countries.json'
import config from './config'
import { appendNewTooltip } from '../Tooltip/Tooltip'

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

/**
 * Globe dot mesh component
 */
const Dots = () => {
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

    useLayoutEffect(() => {
        positions.forEach((position, index) => {
            const tempObject = new THREE.Object3D()
            tempObject.position.set(position.x, position.y, position.z)
            tempObject.scale.set(DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE)
            tempObject.updateMatrix()
            ref.current.setMatrixAt(index, tempObject.matrix)
        })
        ref.current.instanceMatrix.needsUpdate = true
    }, [])

    return (
        <instancedMesh ref={ref} args={[null, null, positions.length]}>
            <icosahedronBufferGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color='white' />
        </instancedMesh>
    )
}

/**
 * Country geo-location dot mesh component
 */
const CountryDots = ({ onClick, countries }) => {
    const ref = useRef()
    const [renderedTooltips, setRenderedTooltips] = useState({})
    const [clickedTooltips, setClickedTooltips] = useState({})

    const positions = useMemo(
        () =>
            COUNTRY_POINTS.filter((point) => countries.includes(point.country)),
        [countries]
    )

    useLayoutEffect(() => {
        positions.forEach((position, index) => {
            const tempObject = new THREE.Object3D()
            tempObject.position.set(position.x, position.y, position.z)
            tempObject.scale.set(DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE)
            tempObject.updateMatrix()
            ref.current.setMatrixAt(index, tempObject.matrix)
        })
        ref.current.instanceMatrix.needsUpdate = true
    }, [])

    useFrame(({ clock }) => {
        const base = clock.elapsedTime * 2
        const scale = 1 + Math.abs(Math.sin(base))
        positions.forEach(({ x, y, z }, index) => {
            const tempObject = new THREE.Object3D()
            tempObject.position.set(x, y, z)
            tempObject.scale.set(scale, scale, scale)
            tempObject.updateMatrix()
            ref.current.setMatrixAt(index, tempObject.matrix)
        })
        ref.current.instanceMatrix.needsUpdate = true
    })

    const handleMouseOut = (id) => {
        const tooltip = renderedTooltips[id]
        if (tooltip) {
            tooltip.remove()
        }
        setRenderedTooltips((prev) => ({
            ...prev,
            [id]: undefined,
        }))
        setClickedTooltips((prev) => ({
            ...prev,
            [id]: undefined,
        }))
    }

    const handleMouseIn = (id, x, y, clicked) => {
        setRenderedTooltips((prev) => ({
            ...prev,
            [id]: appendNewTooltip({
                y,
                x,
                props: {
                    data: { country: positions[id].country },
                    clicked,
                    key: id,
                    handleClose: () => handleMouseOut(id),
                },
            }),
        }))
    }

    return (
        <instancedMesh
            ref={ref}
            args={[null, null, positions.length]}
            onClick={({ instanceId }) => {
                // handleMouseIn(instanceId, clientX, clientY, true)
                // setClickedTooltips((prev) => ({
                //     ...prev,
                //     [instanceId]: true,
                // }))
                onClick(positions[instanceId])
            }}
            onPointerOver={({ instanceId, clientX, clientY }) => {
                handleMouseIn(instanceId, clientX, clientY)
            }}
            onPointerOut={({ instanceId }) => {
                if (clickedTooltips[instanceId]) {
                    return
                }
                handleMouseOut(instanceId)
            }}
        >
            <icosahedronBufferGeometry args={[3, 1, 1]} />
            <meshBasicMaterial transparent color='#1DB954' opacity={0.5} />
        </instancedMesh>
    )
}

CountryDots.propTypes = {
    onClick: PropTypes.func,
    countries: PropTypes.arrayOf(PropTypes.string),
}

CountryDots.defaultProps = {
    onClick: () => {},
    countries: COUNTRY_POINTS.map((point) => point.country),
}

/**
 * Dot mesh combination component
 */
const Globe = ({ onClickCountry, includeCountries }) => (
    <>
        <Dots />
        <CountryDots onClick={onClickCountry} countries={includeCountries} />
    </>
)

Globe.propTypes = {
    onClickCountry: PropTypes.func.isRequired,
    includeCountries: PropTypes.arrayOf(PropTypes.string),
}

export default Globe
