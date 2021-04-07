import React from 'react'
import PropTypes from 'prop-types'

/**
 * Helper function to get formatted heading class name
 * @param {'h1' | 'h2' | 'h3'} heading
 * @param {string} textContent
 * @param {string} overrideHeadingStyle
 */
const getHeading = (heading, textContent, overrideHeadingStyle = '') => {
    switch (heading) {
        case 'h1':
            return (
                <h1
                    className={`rounded-sm font-sans font-bold text-3xl w-auto inline-block p-2 text-white ${overrideHeadingStyle}`}
                >
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
    subHeadingText,
    children: visualization,
    subtitle,
    headingStyle,
}) => (
    <div className='relative mb-2 mt-2 w-full'>
        <header
            className={`pb-2 ${
                heading === 'h1' ? 'bg-white sticky z-10 top-0 pt-2' : ''
            }`}
        >
            {getHeading(heading, headingText, headingStyle)}
            {subHeadingText && (
                <p className='text-gray-600'>{subHeadingText}</p>
            )}
        </header>
        {visualization}
        {subtitle && <p className='block font-size mt-2 mb-2'>{subtitle}</p>}
    </div>
)

VisualizationBox.propTypes = {
    heading: PropTypes.oneOf(['h1', 'h2', 'h3']),
    headingText: PropTypes.string,
    subHeadingText: PropTypes.string,
    children: PropTypes.node,
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    headingStyle: PropTypes.string,
}

VisualizationBox.defaultProps = {
    headingStyle: 'bg-green-600',
}

export default VisualizationBox
