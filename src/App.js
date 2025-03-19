import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import TablePage from './pages/TablePage';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/table" element={<TablePage />} />
            </Routes>
        </div>
    );
}

export default App;



