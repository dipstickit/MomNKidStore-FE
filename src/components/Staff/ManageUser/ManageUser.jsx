import React, { useEffect, useState } from 'react'
import './ManageUser.scss'
import { MainAPI } from '../../API';
import { Spinner } from "react-bootstrap";

export default function ManageUser() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState();

    useEffect(() => {
        const fetchData = () => {
            fetch(`${MainAPI}/staff/user`, {
                method: "GET",
                headers: { "x-access-token": JSON.parse(localStorage.getItem("accessToken")) }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch data get user");
                    return res.json();
                })
                .then(data => {
                    setUsers(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching data user:", error);
                    setLoading(false);
                });
        };

        fetchData();
    }, []);

    return (
        <>
            {
                loading ? (
                    <>
                        <div className=" spinner-user">
                            <Spinner animation="border" role="status" />
                        </div>
                    </>
                ) : (
                    <div className='user'>
                        <div className='user-th'>
                            <table className='table-user-th'>
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>User Name</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        <div className='user-tb'>
                            <table className='table-user-tb'>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.user_id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.role_id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </>
    )
}
