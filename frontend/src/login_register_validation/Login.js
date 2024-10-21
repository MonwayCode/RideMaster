import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Validation from './LoginValid';

function Login ()
{
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: Validation({ ...values, [name]: value })[name] }));
    };

    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.email === "" && errors.password === "")
        {
            axios.post('http://localhost:3001/logowanie', values).then(res => {
                if(res.data.error === null)
                {
                    window.localStorage.setItem("userId",res.data.userId);
                    navigate('/');
                }
                else
                {
                    alert("Użytkownik nie istnieje")
                }
            }).catch(err => console.log(err));
        }
    };

    return (
        <section className=" bg-dark vh-100" >
            <div className="container h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                        <div className="card" style={{ borderRadius: '1rem' }}>
                            <div className="row g-0">
                                <div className="col-md-6 d-flex justify-content-center align-items-center"
                                    style = {{ backgroundColor: '#F8EDE3', borderRadius: '1rem 0 0 1rem' }}>
                                    <img
                                        src={logo}
                                        alt="logo"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem', maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                                <div className="col-md-6 d-flex align-items-center ">
                                    <div className="card-body p-8 text-black">
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center pb-1">
                                                <i style={{ color: '#ff6219' }}></i>
                                                <span className="h1 fw-bold mb-0">Logowanie</span>
                                            </div>
                                            <div className="form-outline mb-3">
                                                <input type="email" name="email" id="email" className="form-control form-control-lg" onChange={handleInput} />
                                                <label className="form-label" htmlFor="email">Adres email</label>
                                                {errors.email && <div className='text-danger'>{errors.email}</div>}
                                            </div>
                                            <div className="form-outline mb-3">
                                                <input type="password" id="password" name="password" className="form-control form-control-lg" onChange={handleInput} />
                                                <label className="form-label" htmlFor="password">Hasło</label>
                                                {errors.password && <div className='text-danger'>{errors.password}</div>}
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button className="btn btn-lg btn-block" type="submit" style={{backgroundColor: '#4E4562', color: '#bbbcd0'}}>
                                                    Zaloguj
                                                </button>
                                            </div>
          
                                            <p className="mb-0 " style={{ color: '#393f81' }}> 
                                                Nie masz jeszcze konta? <a href="/registration" style={{ color: '#393f81' }}>Zarejestruj się!</a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
