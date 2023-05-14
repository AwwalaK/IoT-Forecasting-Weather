
import './App.css';
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './container/Home/index';
import About from './components/About';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className='h-screen'>
            <Navbar />
            <Home />
          </div>
        } />
        <Route path="/about" element={<><Navbar /><About /></>} />
      </Routes>
    </Router>
  );
}

export default App;