import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBarStaff.scss'
import { MainAPI } from '../../API';
import AuthContext from '../../../context/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function NavBarStaff() {

    // useEffect(() => {
    //     nav('/staff/comfirm_order');
    // }, []);

    // const token = JSON.parse(localStorage.getItem("accessToken"));
    // const { auth, setAuth } = useContext(AuthContext);
    // const getName = auth.user.username
    // console.log(getName)
    const nav = useNavigate();

    const handleLogout = () => {
        // axios
        //     .post(`${MainAPI}/user/logout`, token, {
        //         headers: {
        //             "x-access-token": token,
        //         },
        //     })
        //     .then((res) => {
        //         console.log(res.data);
        //         localStorage.removeItem("accessToken");
        //         localStorage.removeItem("auth");
        //         localStorage.removeItem("name")
        //         setAuth({});
        //         toast.success("Đăng xuất thành công");
        //         nav("/login");
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    };

    return (
        <div className='staff'>
            <div className='logo_staff'>
                <img src='https://res.cloudinary.com/dmyyf65yy/image/upload/v1722845760/fresh-milk-with-text-banner_1308-6819.jpg_nefazw.jpg' />
            </div>

            <div className='user_name'>
                {/* <p><span>User Name:</span>&nbsp; {getName}</p> */}
            </div>

            <div>
                <button className="btn btn-secondary"
                    style={{ textAlign: 'center', borderRadius: '50px', border: 'none' }}
                    onClick={handleLogout}
                >
                    Đăng xuất
                </button>
            </div>

            <div className='line'></div>

            <div className='staff_nav'>
                <div className='staff_playout'>
                    <Link to={'/staff/comfirm_order'}>Confirm Order</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/manage_inventory'}>Manage Inventory</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/manage_users'}>Manage Users</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/create_voucher_codes'}>Create Voucher Codes</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/track_orders'}>Track Orders</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/report'}>Manage Report</Link>
                </div>
                <div className='staff_playout'>
                    <Link to={'/staff/manage_posts'}>Manage Posts</Link>
                </div>
            </div>
        </div>
    )
}