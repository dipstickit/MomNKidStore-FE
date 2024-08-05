import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.scss";

export default function Unauthorized() {
  const nav = useNavigate();

  const goBack = () => nav("/login");

  return (
    <div
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div>
        <div className="text-center">
          <h1 className="display-1 text-danger">403</h1>
          <h2 className="mb-4">Unauthorized Access</h2>
          <p className="lead mb-5">
            You do not have permission to view this page.
          </p>
          <button variant="primary" onClick={goBack} className="unauthorize-button">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
