import React, { Component } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/UserContext';
import { Toaster } from 'react-hot-toast';

class App extends Component {
  render() {
    return (
      <UserProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Rout />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signup" exact element={<SignUp />} />
              <Route path="/dashboard" exact element={<Home />} />
              <Route path="/income" exact element={<Income />} />
              <Route path="/expense" exact element={<Expense />} />
            </Routes>
            <Toaster 
                toasterOptions={{
                  className : "",
                  style : {
                    fontSize: '13px',
                  }
                }}
            />
          </Router>
        </div>
      </UserProvider>
    )
  }
}

export default App;


const Rout = () => {
  //Verifier l'existence de l'utilisateur
  const isAuthenticated = !!localStorage.getItem("token");

  //Rediriger vers la page de Dashboard si l'utilisateur est authentifié
  return (
    isAuthenticated
      ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/login" />
      )
  );
}