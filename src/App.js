import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TripForm from './components/TripForm';
import MapComponent from './components/MapComponent';
import LogSheet from './components/LogSheet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TripForm />} />
        <Route path="/map" element={<MapComponent />} />
        <Route path="/logs" element={<LogSheet />} />
      </Routes>
    </Router>
  );
}

export default App;
