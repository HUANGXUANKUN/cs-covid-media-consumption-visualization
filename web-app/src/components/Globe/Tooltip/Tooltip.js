import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

/**
 * Helper method to create new tooltip component
 * @param {{ x: number, y: number, props: Record<string, any> }}
 */
export const appendNewTooltip = ({ x, y, props }) => {
    const id = `tooltip-${props.key}`
    let container = document.getElementById(id)
    if (container === null) {
        const newContainer = document.createElement('div')
        newContainer.setAttribute('class', 'tooltip-container')
        if (props.key) {
            newContainer.setAttribute('id', id)
        }
        container = document.body.appendChild(newContainer)
    }
    ReactDOM.render(
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Tooltip key={props.key} position={{ x, y }} {...props} />,
        container
    )
    return container
}

/**
 * Tooltip component
 */
const Tooltip = ({ position, data, clicked, handleClose }) => (
    <div
        className='p-2 rounded-sm bg-white shadow z-50 relative'
        style={{
            position: 'absolute',
            top: `${position.y}px`,
            left: `${position.x}px`,
        }}
    >
        {clicked && (
            <button
                type='button'
                className='absolute w-2 right-1 top-1 focus:ring hover:opacity-50'
                onClick={handleClose}
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                    />
                </svg>
            </button>
        )}
        <h3>Visualization for {data.country}</h3>
    </div>
)

Tooltip.propTypes = {
    position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
        .isRequired,
    data: PropTypes.shape({ country: PropTypes.string }).isRequired,
    clicked: PropTypes.bool,
    handleClose: PropTypes.func,
}

Tooltip.defaultProps = {
    clicked: false,
    handleClose: () => {},
}

export default Tooltip
