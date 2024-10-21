import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home'; 
import Login from './login_register_validation/Login';
import Register from './login_register_validation/Register';
import NewStable from './stable/NewStable';
import Search from './stable/Search';

const App = () => {
  return (
    <Router>
      <Routes>
              <Route path = "/" element={<Home/>} />
              <Route path = "/login" element={<Login/>} />
              <Route path = "/registration" element={<Register/>} />
              <Route path = "/newstable" element={<NewStable/>} />
              <Route path = "/search" element={<Search/>} />
      </Routes>
    </Router>
  );
};

export default App;
