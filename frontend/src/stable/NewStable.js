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

        if (errors.name === "" && errors.location === "") 
            {
            try 
            {
                axios.post('http://localhost:3001/stables/newstable', values).then(res => {
                    alert("Udało ci się dodać stajnie");
                    navigate('/');
                }).catch(err => {
                    alert("Ta stajnia już istanieje w podanej lokalizacji.");
                    navigate('/');
                });
            }
            catch (err) {
                console.error(err); 
            }
        }
    };

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Header />

            <section
                className="d-flex justify-content-center align-items-center"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '110vh',
                }}
                >
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div className="card shadow-lg" style={{ borderRadius: '15px' }}>
                    <div className="card-body p-5">
                        {/* Nagłówek */}
                        <div className="text-center mb-4">
                        <h1 className="fw-bold text-danger">Wprowadź informacje o swojej stajni</h1>
                        </div>

                        {/* Formularz */}
                        <form onSubmit={handleSubmit}>
                        {/* Pole: Nazwa Stajni */}
                        <div className="form-outline mb-4">
                            <label className="form-label fw-bold" htmlFor="name">
                            Nazwa Stajni
                            </label>
                            <input
                            id="name"
                            name="name"
                            className="form-control form-control-lg"
                            onChange={handleInput}
                            placeholder="Wpisz nazwę stajni"
                            required
                            />
                            {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                        </div>

                        {/* Pole: Lokalizacja Stajni */}
                        <div className="form-outline mb-4">
                            <label className="form-label fw-bold" htmlFor="location">
                            Lokalizacja Stajni
                            </label>
                            <input
                            id="location"
                            name="location"
                            className="form-control form-control-lg"
                            onChange={handleInput}
                            placeholder="Wpisz lokalizację stajni"
                            required
                            />
                            {errors.location && <div className="text-danger mt-1">{errors.location}</div>}
                        </div>

                        {/* Przycisk: Dodaj Stajnie */}
                        <div className="text-center">
                            <button
                            type="submit"
                            className="btn btn-danger"
                            style={{
                                padding: '12px 30px',
                                borderRadius: '8px',
                                fontSize: "20px",
                                transition: 'background-color',
                            }}
                            >
                            Dodaj stajnię
                            </button>
                        </div>
                        </form>

                        {/* Tekst pomocniczy */}
                        <p className="text-center mt-4" style={{ color: '#6c757d' }}>
                        Chcesz dołączyć do stajni, a nie ją dodawać?{' '}
                        <span
                            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => navigate('/')}
                        >
                            Kliknij tutaj!
                        </span>
                        </p>
                    </div>
                    </div>
                </div>
            </section>


        </div>
    );
}

export default NewStable;
