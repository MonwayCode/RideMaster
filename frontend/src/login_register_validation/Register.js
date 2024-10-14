import React, { useState } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import Validation from './RegisterValid'; 


function Register ()
{
    const [values, setValues] = useState({
        name : '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        const {name, value} = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: Validation({ ...values, [name]: value }) [name] }));
    }

    const navigate = useNavigate();

    const handleSubmit = (event) => {

        event.preventDefault();  //zabezpieczenie przed odświeżeniem się strony
        setErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === "")
        {
            axios.post('http://localhost:3001/rejestracja',values).then(res => {
                navigate('/login')
            }).catch(err => console.log(err));
        }
    }

    return (
        <section className="vh-100" style={{ backgroundColor: '#D0B8A8' }}>
            <div className="container h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                        <form onSubmit={handleSubmit}>
                        <div className="card" style={{ borderRadius: '1rem' }}>
                            <div className="row g-0">
                                <div className="col-md-6 d-flex justify-content-center align-items-center"
                                    style={{ backgroundColor: '#F8EDE3', borderRadius: '1rem 0 0 1rem' }}>
                                    <img
                                        src={logo}
                                        alt="logo"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem', maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                                <div className="col-md-6 d-flex align-items-center">
                                    <div className="card-body p-4 text-black">

                                            <div className="d-flex align-items-center pb-1">
                                                <i style={{ color: '#FF6219' }}></i>
                                                <span className="h1 fw-bold mb-0">Rejestracja</span>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input id="name" name="name" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="name">Imie</label>
                                                {errors.name && <div className='text-danger'>{errors.name}</div>}
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input type="email" id="email" name="email" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="email">Adres email</label>
                                                {errors.email && <div className='text-danger'>{errors.email}</div>}
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input type="password" id="password" name="password" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="password">Hasło</label>
                                                {errors.password && <div className='text-danger'>{errors.password}</div>}
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button className="btn btn-lg btn-block" type="submit" style={{backgroundColor: '#4E4562', color: '#FFECDE'}}>
                                                    Zarejestruj
                                                </button>
                                            </div>
                                            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                                                <div>
                                                    Masz już konto?
                                                </div>
                                                <div>
                                                    <a href="/login" style={{ color: '#393f81' }}>Zaloguj się!</a>
                                                </div>
                                            </p>
                                
                                    </div>
                                </div>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
