import React from "react";
import "./Advertise.scss";
import Carousel from 'react-bootstrap/Carousel';

export default function Advertise() {
  return (
    <div className="ad">
      <Carousel>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Fadvertise%2Fqc.png?alt=media&token=b59fbf4e-db19-4f61-a1a7-36bc8257863e"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Fadvertise%2Fad2.png?alt=media&token=4d5eee70-1cd0-4cb8-a806-0bc18129f878"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Fadvertise%2Fad4.png?alt=media&token=971a2b04-ef3d-44c2-9511-1f9f671e5950"
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Fadvertise%2Fad3.png?alt=media&token=de896a65-f4c6-44f3-83ad-fbf453db6dde"
            alt="Fourth slide"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Fadvertise%2Fad.png?alt=media&token=58859201-f61c-453c-98b9-74c54b7ec57e"
            alt="Fifth slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
