import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from "../utils/Header/Header"
import Footer from "../utils/Footer/FooterPage"
import './PaymentFail.scss';

const PaymentFail = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate('/purchase-history');
    };

    return (
        <div>
            <Header />
            <div className="payment-fail">
                <div className="animation-container">
                    <FaTimesCircle className="fail-icon" />
                    <h2>Payment Failed</h2>
                    <p>We encountered an issue while processing your payment.</p>
                    <p>Please try again later or contact support.</p>
                    <button className="retry-payment" onClick={handleRetry}>
                        Retry Payment
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentFail;
