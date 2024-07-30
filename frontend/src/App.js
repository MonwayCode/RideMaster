import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

//import Home from './Home'; 
import Login from './login_register_validation/Login';

const App = () => {
  return (
    <Router>
      <Routes>
               <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
