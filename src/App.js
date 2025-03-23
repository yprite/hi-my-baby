import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Login';
import TablePage from './pages/TablePage';

function App() {
    return (
        <ChakraProvider>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/table" element={<TablePage />} />
                </Routes>
            </div>
        </ChakraProvider>
    );
}

export default App;



