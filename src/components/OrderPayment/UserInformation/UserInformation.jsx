import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { MainAPI } from "../../API";

export default function UserInformation() {
  const [userInformation, setUserInformation] = useState({});
  const { auth } = useAuth();

  //GET USERINFORMATION
  useEffect(() => {
    const getUserInformation = async () => {
      await axios
        .get(`${MainAPI}/user/show-all-phone-address/${auth.user.user_id}`, {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        })
        .then((res) => {
          console.log(res.data);
          setUserInformation(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    };
    getUserInformation();
  }, []);

  return (
    <div className="user-information">
      <h5>Địa chỉ khách hàng</h5>
      <div className="">
        <div className="summary-item">
          {userInformation.username}: <span>{userInformation.phone}</span>
        </div>
        <div>
          <small>{userInformation.address}</small>
        </div>
      </div>
    </div>
  );
}
