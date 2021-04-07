import React from 'react'
import PropTypes from 'prop-types'

/**
 * Helper function to get formatted heading class name
 * @param {'h1' | 'h2' | 'h3'} heading
 * @param {string} textContent
 */
const getHeading = (heading, textContent) => {
    switch (heading) {
        case 'h1':
            return (
                <h1 className='sticky bg-white z-10 pb-2 top-0 font-sans font-bold text-3xl w-full'>
                    {textContent}
                </h1>
            )
        case 'h2':
            return (
                <h2 className='font-sans font-semibold text-xl w-full'>
                    {textContent}
                </h2>
            )
        default:
            throw new Error()
    }
}

/**
 * Visualization box component with textual contents
 */
const VisualizationBox = ({
    heading,
    headingText,
    children: visualization,
    subtitle,
}) => (
    <div className='relative mb-2 mt-2 w-full'>
        {getHeading(heading, headingText)}
        {visualization}
        {subtitle && (
            <subtitle className='block font-size mt-2 mb-2'>
                {subtitle}
            </subtitle>
        )}
    </div>
)

VisualizationBox.propTypes = {
    heading: PropTypes.oneOf(['h1', 'h2', 'h3']),
    headingText: PropTypes.string,
    children: PropTypes.node,
    subtitle: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
}

export default VisualizationBox
