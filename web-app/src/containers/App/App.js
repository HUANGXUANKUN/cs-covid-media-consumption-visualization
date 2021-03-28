import React from 'react'
import GlobeCanvas from '../../components/GlobeCanvas'
import { TimerContextWrapper } from '../../contexts'
import Visualization from '../Visualization'
import './App.css'

const App = () => (
    <TimerContextWrapper>
        <div className='app'>
            <div className='canvas-container'>
                <GlobeCanvas />
            </div>
            <div className='visualization-container'>
                <Visualization />
            </div>
        </div>
    </TimerContextWrapper>
)

export default App
