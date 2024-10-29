import React, { useState } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import Validation from './RegisterValid'; 


function Register ()
{
    const [values, setValues] = useState({
        name : '',
        surname : '',
        email : '',
        phone : '',
        password : ''
    });

    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        const {name, value} = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: Validation({ ...values, [name]: value })[name] }));
    }

    const navigate = useNavigate();

    const handleSubmit = (event) => {

        event.preventDefault();  //zabezpieczenie przed odświeżeniem się strony
        setErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === "")
        {
            axios.post('http://localhost:3001/users/register',values).then(res => {
                navigate('/login')
            }).catch(err => console.log(err));
        }
    }

    return (
        <section className=" bg-dark vh-100">
            <div className="container h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                        <form onSubmit={handleSubmit}>
                        <div className="card" style={{ borderRadius: '1rem', border: 'none', maxWidth: '900px', margin: 'auto',  maxHeight: '90vh', overflow: 'auto' }}>
                            <div className="row g-0">
                                <div className="col-md-6 d-flex justify-content-center align-items-center"
                                    style={{ backgroundColor: '#4e4562', borderRadius: '1rem 0 0 1rem' }}>
                                    <img
                                        src={logo}
                                        alt="logo"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem', maxWidth: '100%', height: 'auto', marginRight: '5px' }}
                                    />
                                </div>
                                <div className="col-md-6 d-flex align-items-center">
                                    <div className="card-body p-4 text-black">

                                            <div className="d-flex align-items-center pb-1">
                                                <i style={{ color: '#FF6219' }}></i>
                                                <span className="h1 fw-bold mb-0">Rejestracja</span>
                                            </div>

                                            <div className="form-outline mb-3">
                                                <input id="name" name="name" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="name">Imie</label>
                                                {errors.name && <div className='text-danger'>{errors.name}</div>}
                                            </div>

                                            <div className="form-outline mb-3">
                                                <input id="surname" name="surname" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="surname">Nazwisko</label>
                                                {errors.surname && <div className='text-danger'>{errors.surname}</div>}
                                            </div>

                                            <div className="form-outline mb-3">
                                                <input type="email" id="email" name="email" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="email">Adres email</label>
                                                {errors.email && <div className='text-danger'>{errors.email}</div>}
                                            </div>

                                            <div className="form-outline mb-3">
                                                <input id="phone" name="phone" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="phone">Numer telefonu</label>
                                                {errors.phone && <div className='text-danger'>{errors.phone}</div>}
                                            </div>

                                            <div className="form-outline mb-3">
                                                <input type="password" id="password" name="password" className="form-control form-control-lg" onChange={handleInput}/>
                                                <label className="form-label" htmlFor="password">Hasło</label>
                                                {errors.password && <div className='text-danger'>{errors.password}</div>}
                                            </div>

                                            <div className="pt-1 mb-3">
                                                <button className="btn btn-lg btn-block" type="submit" style={{backgroundColor: '#4E4562', color: '#bbbcd0'}}>
                                                    Zarejestruj
                                                </button>
                                            </div>
                                            
                                            <p className="mb-0 " style={{ color: '#393f81' }}> 
                                                Masz już konto? <a href="/login" style={{ color: '#393f81' }}>Zaloguj się!</a>
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
