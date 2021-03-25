import React from 'react'
import GlobeCanvas from '../../components/GlobeCanvas'
import Visualization from '../../components/Visualization'
import './App.css'

const App = () => (
    <div className='app'>
        <div className='canvas-container'>
            <GlobeCanvas />
        </div>
        <div className='visualization-container'>
            <Visualization />
        </div>
    </div>
)

export default App
