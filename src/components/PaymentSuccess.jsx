import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from "../utils/Header/Header"
import Footer from "../utils/Footer/FooterPage"
import './PaymentSuccess.scss';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/purchase-history');
    };

    return (
        <div>
            <Header />
            <div className="payment-success">
                <div className="fireworks">
                    <div className="firework"></div>
                    <div className="firework"></div>
                    <div className="firework"></div>
                </div>
                <div className="animation-container">
                    <FaCheckCircle className="success-icon" />
                    <h2>Payment Successful!</h2>
                    <p>Thank you for your purchase.</p>
                    <p>An email receipt has been sent to your email address.</p>
                    <button className="go-to-purchase-history" onClick={handleClick}>
                        Go to Purchase History
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
