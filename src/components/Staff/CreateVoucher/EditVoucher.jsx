import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./EditVoucher.scss";
import { MainAPI } from "../../API";
import NavbarStaff from "../NavBar/NavBarStaff";

const EditVoucher = () => {
    const { voucherId } = useParams();
    const [voucher, setVoucher] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVoucher = async () => {
            const token = JSON.parse(localStorage.getItem("accessToken"));

            if (!token) {
                toast.error("No access token found. Please log in again.");
                return;
            }

            try {
                const response = await axios.get(
                    `${MainAPI}/VoucherOfShop/staff/${voucherId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setVoucher(response.data);
                formik.setValues({
                    voucherValue: response.data.voucherValue,
                    voucherQuantity: response.data.voucherQuantity,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate,
                });
            } catch (error) {
                console.error("Error fetching voucher details:", error);
                toast.error("An error occurred while fetching voucher details.");
            }
        };

        fetchVoucher();
    }, [voucherId]);

    const validationSchema = Yup.object({
        voucherValue: Yup.number()
            .required("Voucher value is required")
            .positive("Voucher value must be a positive number")
            .integer("Voucher value must be an integer"),
        voucherQuantity: Yup.number()
            .required("Quantity is required")
            .positive("Quantity must be a positive number")
            .integer("Quantity must be an integer"),
        startDate: Yup.date()
            .required("Start date is required")
            .max(Yup.ref('endDate'), "Start date must be before or the same as end date"),
        endDate: Yup.date()
            .required("End date is required")
            .min(Yup.ref('startDate'), "End date must be after start date"),
    });

    const formik = useFormik({
        initialValues: {
            voucherValue: "",
            voucherQuantity: "",
            startDate: "",
            endDate: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const token = JSON.parse(localStorage.getItem("accessToken"));

           if (!token) {
                toast.error("No access token found. Please log in again.");
                return;
            }

            try {
                const response = await axios.put(
                    `${MainAPI}/VoucherOfShop/${voucherId}`,
                    {
                        voucherValue: Number(values.voucherValue),
                        voucherQuantity: Number(values.voucherQuantity),
                        startDate: values.startDate,
                        endDate: values.endDate,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast.success("Voucher updated successfully");
                navigate("/staff/create_voucher_codes");
            } catch (error) {
                console.error("Error updating voucher:", error);
                toast.error("An error occurred while updating the voucher.");
            }
        },
    });

    const handleBack = () => {
        navigate("/staff/create_voucher_codes");
    };

    return (
        <div className="layout-container">
            <NavbarStaff />
            <div className="content-container">
                <div className="edit-voucher">
                    <h2>Edit Voucher</h2>
                    {voucher ? (
                        <form onSubmit={formik.handleSubmit} className="edit-form">
                            <div className="form-group">
                                <label>Voucher Value:</label>
                                <input
                                    type="number"
                                    name="voucherValue"
                                    value={formik.values.voucherValue}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.voucherValue && formik.errors.voucherValue ? (
                                    <div className="error-message">{formik.errors.voucherValue}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    name="voucherQuantity"
                                    value={formik.values.voucherQuantity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.voucherQuantity && formik.errors.voucherQuantity ? (

                                    <div className="error-message">{formik.errors.voucherQuantity}</div>

<div className="error-message">{formik.errors.voucherQuantity}</div>

                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formik.values.startDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.startDate && formik.errors.startDate ? (
                                    <div className="error-message">{formik.errors.startDate}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>End Date:</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formik.values.endDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.endDate && formik.errors.endDate ? (
                                    <div className="error-message">{formik.errors.endDate}</div>
                                ) : null}
                            </div>
                            <div className="button-group">
                                <button type="button" className="back-button" onClick={handleBack}>
                                    <FaArrowLeft /> Back to manage Voucher
                                </button>
                                <button type="submit" className="update-button">
                                    <FaSave /> Update Voucher
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditVoucher;
