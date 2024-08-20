import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.scss';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/purchase-history');
    };

    return (
        <div className="payment-success">
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
    );
};

export default PaymentSuccess;
