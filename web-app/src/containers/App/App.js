import React from 'react'
import {
    TimerContext,
    TimerContextWrapper,
    VisualizationContext,
    VisualizationContextWrapper,
} from '../../contexts'
import TimePicker from '../../components/TimePicker'
import Visualization from '../Visualization'
import './App.css'
import GlobeCanvas from '../GlobeCanvas'
import { transformCountryCodeToFullName } from '../../queries/region'

/**
 * Main entry
 */
const App = () => (
    <TimerContextWrapper>
        <VisualizationContextWrapper>
            <div className='h-full w-full flex items-center justify-around relative'>
                <div className='canvas-container h-full flex flex-col justify-center'>
                    <GlobeCanvas />
                    <TimerContext.Consumer>
                        {({ currentDate }) => (
                            <div className='flex flex-col p-2 items-center text-white uppercase'>
                                <TimePicker currentDate={currentDate} />
                                <VisualizationContext.Consumer>
                                    {({ state }) => (
                                        <span className=''>
                                            Selected Region:{' '}
                                            {transformCountryCodeToFullName(
                                                state.selectedRegion
                                            )}
                                        </span>
                                    )}
                                </VisualizationContext.Consumer>
                            </div>
                        )}
                    </TimerContext.Consumer>
                </div>
                <div className='visualization-container h-full bg-white p-6 rounded shadow'>
                    <Visualization />
                </div>
            </div>
        </VisualizationContextWrapper>
    </TimerContextWrapper>
)

export default App
