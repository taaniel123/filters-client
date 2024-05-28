import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Filters from './pages/Filters';
import './styles.css';

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Filters/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;