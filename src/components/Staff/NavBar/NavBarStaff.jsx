import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBarStaff.scss'
import { toast, ToastContainer } from 'react-toastify';

export default function NavBarStaff() {

    const nav = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth');
        toast.success('Logout successful');
        nav('/login');
    };

    return (
        <div className='staff'>
            <div className='logo_staff'>
                <img src='https://res.cloudinary.com/dmyyf65yy/image/upload/v1722845760/fresh-milk-with-text-banner_1308-6819.jpg_nefazw.jpg' />
            </div>

            <div className='user_name'>
                <p><span>Staff</span>&nbsp;</p>
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
                    <Link to={'/staff/comfirm_order'}>Confirm Order</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/manage_product'}>Manage Product</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/manage_pcategory'}>Manage ProductCategory</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/create_voucher_codes'}>Manage Voucher</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/track_orders'}>Track Orders</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/report'}>Manage Report</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/manage_posts'}>Manage Blog</Link>
                </div>
            </div>
        </div>
    )
}