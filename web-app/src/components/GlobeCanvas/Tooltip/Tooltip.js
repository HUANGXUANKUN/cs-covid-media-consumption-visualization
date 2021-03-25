import React from 'react'
import ReactDOM from 'react-dom'

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

export default Tooltip
