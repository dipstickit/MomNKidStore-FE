import React from 'react';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { MdHome, MdEmail, MdPhone, MdPrint } from 'react-icons/md';
import './FooterPage.scss';

export default function FooterPage() {
  return (
    <footer className='footer text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <FaFacebookF color='secondary' />
          </a>
          <a href='' className='me-4 text-reset'>
            <FaTwitter color='secondary' />
          </a>
          <a href='' className='me-4 text-reset'>
            <FaGoogle color='secondary' />
          </a>
          <a href='' className='me-4 text-reset'>
            <FaInstagram color='secondary' />
          </a>
          <a href='' className='me-4 text-reset'>
            <FaLinkedinIn color='secondary' />
          </a>
          <a href='' className='me-4 text-reset'>
            <FaGithub color='secondary' />
          </a>
        </div>
      </section>

      <section>
        <div className='container text-center text-md-start mt-5'>
          <div className='row mt-3'>
            <div className='col-md-3 lg-4 xl-3 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MdHome color='secondary' className='me-3' />
                Company name
              </h6>
              <p>
                Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit
                amet, consectetur adipisicing elit.
              </p>
            </div>

            <div className='col-md-2 lg-2 xl-2 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Customer Care</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Payment instructions
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Buying Guide
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Return policy
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className='col-md-3 lg-2 xl-2 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Pricing
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Settings
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Orders
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Help
                </a>
              </p>
            </div>

            <div className='col-md-4 lg-3 xl-3 mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MdHome color='secondary' className='me-2' />
                FPT University Ho Chi Minh City

                Address: Lot E2a-7, Road D1, Long Thanh My, Thu Duc City, Ho Chi Minh City
              </p>
              <p>
                <MdEmail color='secondary' className='me-3' />
                info@example.com
              </p>
              <p>
                <MdPhone color='secondary' className='me-3' /> +84 1 234 567 88
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 Copyright
      </div>
    </footer>
  );
}
