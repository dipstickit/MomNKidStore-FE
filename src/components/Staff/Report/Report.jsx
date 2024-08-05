import React, { useEffect, useState } from 'react'
import './Report.scss'
import { MainAPI } from '../../API';
import { convertSQLDate } from '../../../utils/Format';
import { Spinner } from "react-bootstrap";

export default function Report() {
    const [loading, setLoading] = useState(true);
    const [reports, setReport] = useState([])

    const fetchData = () => {
        fetch(`${MainAPI}/staff/show-all-report`, {
            method: "GET",
            headers: { "x-access-token": JSON.parse(localStorage.getItem("accessToken")) }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch data get report");
                return res.json();
            })
            .then(data => {
                setReport(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data report:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log(reports)

    return (
        <>
            {
                loading ? (
                    <>
                        <div className=" spinner-report">
                            <Spinner animation="border" role="status" />
                        </div>
                    </>
                ) : (
                    <div className='report'>
                        <div className='report-th'>
                            <table className='table-report-th'>
                                <thead>
                                    <tr>
                                        <th>Report ID</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>User Name</th>
                                        <th>Product Name</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        <div className='report-tb'>
                            <table className='table-report-tb'>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.report_id}>
                                            <td>{report.report_id}</td>
                                            <td>{convertSQLDate(report.report_date)}</td>
                                            <td>{report.report_description}</td>
                                            <td>{report.username}</td>
                                            <td>{report.product_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div >
                )
            }
        </>
    )
}
