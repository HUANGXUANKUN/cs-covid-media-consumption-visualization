import React from 'react'
import PropTypes from 'prop-types'

/**
 * Tab group component
 */
const TabGroup = ({ group, selected, onClick }) => (
    <div className='mt-2 border-b-2 border-gray-300'>
        <ul className='flex cursor-pointer m-auto'>
            {group.map((element) => (
                <li
                    key={element.key}
                    className={`py-1 px-6 bg-white ${
                        element.key !== selected.key
                            ? 'rounded-t-lg text-gray-500 bg-gray-200'
                            : ''
                    }`}
                >
                    <div
                        className='focus:outline-none'
                        role='button'
                        onClick={() => onClick(element)}
                        onKeyPress={() => {}}
                        tabIndex={0}
                    >
                        {element.name}
                    </div>
                </li>
            ))}
        </ul>
    </div>
)

TabGroup.propTypes = {
    group: PropTypes.arrayOf(
        PropTypes.shape({ key: PropTypes.string, name: PropTypes.string })
    ),
    selected: PropTypes.shape({
        key: PropTypes.string,
        name: PropTypes.string,
    }),
    onClick: PropTypes.func,
}

export default TabGroup
