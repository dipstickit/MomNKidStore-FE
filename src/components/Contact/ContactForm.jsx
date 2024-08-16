import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './ContactPage.scss';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validateForm = () => {
        let formErrors = {};
        let valid = true;

        if (!formData.name) {
            valid = false;
            formErrors.name = 'Vui lòng nhập tên của bạn.';
        }

        if (!formData.email) {
            valid = false;
            formErrors.email = 'Vui lòng nhập email của bạn.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            valid = false;
            formErrors.email = 'Email không hợp lệ.';
        }

        if (!formData.service) {
            valid = false;
            formErrors.service = 'Vui lòng nhập dịch vụ bạn quan tâm.';
        }

        if (!formData.phone) {
            valid = false;
            formErrors.phone = 'Vui lòng nhập số điện thoại của bạn.';
        } else if (!/^\d+$/.test(formData.phone)) {
            valid = false;
            formErrors.phone = 'Số điện thoại không hợp lệ.';
        }

        if (!formData.message) {
            valid = false;
            formErrors.message = 'Vui lòng nhập nội dung tin nhắn.';
        }

        setErrors(formErrors);
        return valid;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Submit form data
            console.log('Form submitted successfully:', formData);
            setSubmitted(true);
        } else {
            setSubmitted(false);
        }
    };

    return (
        <Container className="contact-form">
            <Row>
                <Col md={10} className="offset-md-1">
                    <h3>Bạn có câu hỏi nào không?</h3>
                    <p>
                        <strong>Giờ Làm Việc:</strong> Thứ 2 – Thứ 6: 08 AM To 06 PM, Thứ 7 & CN: 09 AM To 05 PM
                    </p>
                    {submitted && <Alert variant="success">Form submitted successfully!</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên của bạn"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email của bạn"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formService">
                                    <Form.Control
                                        type="text"
                                        placeholder="Dịch vụ quan tâm"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        isInvalid={!!errors.service}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.service}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formPhone">
                                    <Form.Control
                                        type="text"
                                        placeholder="Số điện thoại của bạn"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        isInvalid={!!errors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="formMessage">
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Nội dung tin nhắn"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                isInvalid={!!errors.message}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="dark" type="submit">
                            Gửi
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactForm;
