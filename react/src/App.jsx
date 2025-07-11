import { useState, useEffect } from 'react';
import './index.css';
import "./App.css";
import Employees from './components/Employees';
import Register from './components/Register'
import Navbar from './components/Navbar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import EmployeeDetail from './components/EmployeeDetail.jsx';
import Prediction from './components/Prediction.jsx';
import Profile from './components/Profile.jsx';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { AuthProvider } from "./useAuth.jsx"
import Login from './components/Login';


export default function App() {

  return (
    <Router>
      <AuthProvider>

        <Navbar fixed="top" />
        <Routes>
          <Route exact path="/" element={
            <Login />
          } />
          <Route path="/employees" element={
            <Employees />
          } />
          <Route path="/employee/:id" element={
            <EmployeeDetail />
          } />
          <Route path="/register" element={
            <Register />
          } />
          <Route path="/prediction" element={
            <Prediction />
          } />
          <Route path="/profile" element={
            <Profile />
          } />



        </Routes>
      </AuthProvider>

    </Router>
  )
}