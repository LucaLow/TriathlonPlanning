import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { render } from "react-dom";
import CalendarView from './CalendarView';
import LoginSignupPage from './login';
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
        <Route path="/login" element={<LoginSignupPage />} />
      </Routes>
    </Router>
  </>
  );
}

export default App;