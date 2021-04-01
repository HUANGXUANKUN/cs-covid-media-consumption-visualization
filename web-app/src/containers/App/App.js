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
import GlobeCanvas from '../../components/GlobeCanvas/GlobeCanvas'

const App = () => (
    <TimerContextWrapper>
        <VisualizationContextWrapper>
            <div className='app'>
                <div className='visualization-container'>
                    <Visualization />
                </div>
                <div className='canvas-container'>
                    <GlobeCanvas />
                </div>
                <div className='timer-container'>
                    <TimerContext.Consumer>
                        {({ currentDate }) => (
                            <>
                                <TimePicker currentDate={currentDate} />
                                <VisualizationContext.Consumer>
                                    {({ state }) => (
                                        <span>{state.selectedRegion}</span>
                                    )}
                                </VisualizationContext.Consumer>
                            </>
                        )}
                    </TimerContext.Consumer>
                </div>
            </div>
        </VisualizationContextWrapper>
    </TimerContextWrapper>
)

export default App
