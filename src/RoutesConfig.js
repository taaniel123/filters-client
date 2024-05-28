import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Filters from './pages/Filters';

const RoutesConfig = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Filters/>}/>
        </Routes>
    </Router>
);
export default RoutesConfig;
