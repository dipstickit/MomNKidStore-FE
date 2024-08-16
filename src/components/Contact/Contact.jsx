import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import './ContactPage.scss';
import HeaderPage from '../../utils/Header/Header';
import FooterPage from '../../utils/Footer/FooterPage';
const Contact = () => {
    return (
        <>
            <HeaderPage />
            <Container className="contact-page">
                <Row>
                    <Col md={5}>
                        <ContactInfo />
                    </Col>
                    <Col md={7}>
                        <ContactForm />
                    </Col>
                </Row>
            </Container>
            <FooterPage />
        </>
    );
};

export default Contact;
