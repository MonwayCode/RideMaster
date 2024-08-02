import React from 'react';
import logo from '../assets/logo.png';

const Register = () => {
    return (
        <section className="vh-100" style={{ backgroundColor: '#D0B8A8' }}>
            <div className="container h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-lg-8 col-md-10 col-sm-12">
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
                                        <form>
                                            <div className="d-flex align-items-center pb-1">
                                                <i style={{ color: '#FF6219' }}></i>
                                                <span className="h1 fw-bold mb-0">Registration</span>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input id="name" className="form-control form-control-lg" />
                                                <label className="form-label" htmlFor="name">Name</label>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input type="email" id="email" className="form-control form-control-lg" />
                                                <label className="form-label" htmlFor="email">Email address</label>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input type="password" id="password" className="form-control form-control-lg" />
                                                <label className="form-label" htmlFor="password">Password</label>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input type="password" id="rpassword" className="form-control form-control-lg" />
                                                <label className="form-label" htmlFor="rpassword">Repeat password</label>
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button className="btn btn-lg btn-block" type="button" style={{backgroundColor: '#4E4562', color: '#FFECDE'}}>
                                                    Login
                                                </button>
                                            </div>
                                            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                                                <div>
                                                    Do have an account?
                                                </div>
                                                <div>
                                                    <a href="/login" style={{ color: '#393f81' }}>Login here</a>
                                                </div>
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

export default Register;
