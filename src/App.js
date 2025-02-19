import React from 'react';

function App() {
    return (
        <div className="App" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5'
        }}>
            <h1 style={{
                color: '#333',
                marginBottom: '20px'
            }}>
                🚧 공사중 🚧
            </h1>
            <p style={{
                fontSize: '1.2rem',
                color: '#666'
            }}>
                현재 웹사이트를 준비중입니다. 곧 찾아뵙겠습니다!
            </p>
        </div>
    );
}

export default App;