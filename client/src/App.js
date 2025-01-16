import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MySubmissions from './components/MySubmissions';
import NewSubmission from './components/NewSubmission';

const App = () => (
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/new-submission" element={<NewSubmission />} />
      <Route path="/my-submissions" element={<MySubmissions />} />
    </Routes>
  </Router>
);


export default App;
