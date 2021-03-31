import React from 'react'
import GlobeCanvas from '../../components/GlobeCanvas'
import { TimerContext, TimerContextWrapper } from '../../contexts'
import TimePicker from '../../components/TimePicker'
import Visualization from '../Visualization'
import './App.css'

const App = () => (
    <TimerContextWrapper>
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
                        <TimePicker currentDate={currentDate} />
                    )}
                </TimerContext.Consumer>
            </div>
        </div>
    </TimerContextWrapper>
)

export default App
