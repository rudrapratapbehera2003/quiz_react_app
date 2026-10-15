import React from 'react';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Homepage />
      </main>
    </div>
  );
}

export default App;