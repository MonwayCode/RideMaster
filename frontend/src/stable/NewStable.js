import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from "../Header";
import Validation from './StableValid';

function NewStable() {
    const [values, setValues] = useState({
        name: '',
        location: '',
        ownerId: window.localStorage.getItem("userId")
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

        if (errors.name === "" && errors.location === "") {
            axios.post('http://localhost:3001/nowastajnia', values).then(res => {
                alert("Udało ci się dodać stajnie");
                navigate('/');
            }).catch(err => console.log(err));
        }
    };

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Header />

            <section className="bg-dark flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="container" style={{ maxWidth: '900px', overflow: 'hidden' }}>
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <form onSubmit={handleSubmit}>
                                <div className="card" style={{ borderRadius: '1rem' }}>
                                    <div className="row g-0">
                                        <div className="col-md-12 d-flex align-items-center">
                                            <div className="card-body p-4 text-black">
                                                <div className="d-flex align-items-center pb-1">
                                                    <i style={{ color: '#FF6219' }}></i>
                                                    <span className="h1 fw-bold mb-0 text-center">Wprowadź informacje o swojej stajni</span>
                                                </div>

                                                <div className="form-outline mb-3">
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        className="form-control form-control-lg"
                                                        onChange={handleInput}
                                                    />
                                                    <label className="form-label" htmlFor="name">Nazwa Stajni</label>
                                                    {errors.name && <div className='text-danger'>{errors.name}</div>}
                                                </div>

                                                <div className="form-outline mb-3">
                                                    <input
                                                        id="location"
                                                        name="location"
                                                        className="form-control form-control-lg"
                                                        onChange={handleInput}
                                                    />
                                                    <label className="form-label" htmlFor="location">Lokalizacja stajni</label>
                                                    {errors.location && <div className='text-danger'>{errors.location}</div>}
                                                </div>

                                                <div className="pt-1 mb-3">
                                                    <button
                                                        className="btn btn-lg btn-block"
                                                        type="submit"
                                                        style={{ backgroundColor: '#4E4562', color: '#bbbcd0' }}
                                                    >
                                                        Dodaj stajnie
                                                    </button>
                                                </div>
                                                <p className="mb-0" style={{ color: '#393f81' }}>
                                                    Chcesz dołączyć do stajnie, a nie ją dodawać? 
                                                    <span 
                                                        style={{ color: '#393f81', cursor: 'pointer', textDecoration: 'underline' }} 
                                                        onClick={() => navigate('/')}
                                                    >
                                                        Kliknij tutaj!
                                                    </span>
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
        </div>
    );
}

export default NewStable;
