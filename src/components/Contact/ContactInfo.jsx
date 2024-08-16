import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './ContactPage.scss';

const ContactInfo = () => {
    return (
        <Container className="contact-info">
            <Row>
                <Col md={12}>
                    <h3>Thông tin liên hệ</h3>
                    <p>
                        Hãy liên hệ với chúng tôi ngay hôm nay để đặt lịch hẹn, giải đáp mọi thắc mắc hoặc để trải nghiệm sự yên bình của GutaMilk.
                        Chúng tôi luôn sẵn lòng hỗ trợ bạn trong hành trình làm đẹp của mình.
                    </p>
                    <ul className="contact-details">
                        <li>
                            <i className="fas fa-map-marker-alt"></i> Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ
                        </li>
                        <li>
                            <i className="fas fa-envelope"></i> gutamilk@gmail.com
                        </li>
                        <li>
                            <i className="fas fa-phone"></i> (+84) 39 2272 876
                        </li>
                    </ul>
                    <div className="social-icons">
                        <i className="fab fa-instagram"></i>
                        <i className="fab fa-facebook"></i>
                        <i className="fab fa-youtube"></i>
                        <i className="fab fa-pinterest"></i>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactInfo;
