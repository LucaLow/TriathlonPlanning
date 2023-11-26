import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';
import { render } from "react-dom";
import CalendarView from './CalendarView';
import './App.css';

function App() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
  });
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<CalendarView />} />
      </Routes>
    </Router>
  </>
  );
}

export default App;