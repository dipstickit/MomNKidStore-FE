import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBarDeliverier.scss'
import { toast, ToastContainer } from 'react-toastify';

export default function NavBarStaff() {

    const nav = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth');
        toast.success('Logout successfully');
        nav('/login');
    };

    return (
        <div className='staff'>
            <ToastContainer />
            <div className='logo_staff'>
                <img src='https://res.cloudinary.com/dmyyf65yy/image/upload/v1722845760/fresh-milk-with-text-banner_1308-6819.jpg_nefazw.jpg' />
            </div>

            <div className='user_name'>
                <p><span>Deliverier</span>&nbsp;</p>
            </div>

            <div>
                <button className="btn btn-secondary"
                    style={{ textAlign: 'center', borderRadius: '50px', border: 'none' }}
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div className='line'></div>

            <div className='staff_nav'>
                <div className='staff_playout'>
                    <Link to={'manage_transport'}>Manage Transport </Link>
                </div>
            </div>
        </div>
    )
}