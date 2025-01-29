import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";


const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, {
                name,
                email,
                password,
            });
            navigate("/login"); // Redirect to Login after successful registration
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div style={styles.page}>
            {/* Centered Story-Weaver Header */}
            <div style={styles.headerContainer}>
                <h1 style={styles.header} onClick={() => navigate("/")}>
                    Story-Weaver
                </h1>
            </div>

            {/* Centered SignUp Form */}
            <div style={styles.container}>
                <div style={styles.formBox}>
                    <h2>Sign Up</h2>
                    {error && <p style={styles.error}>{error}</p>}
                    <form onSubmit={handleSignUp}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Sign Up</button>
                    </form>
                    <p style={styles.switchText}>
                        Already have an account?{" "}
                        <button style={styles.linkButton} onClick={() => navigate("/login")}>
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#FDF9F6",
        gap: "10px", // Reducing space between header & form
    },
    headerContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px", // Adjusts spacing between header & signup form
        marginTop : "70px"

    },
    header: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "black",
        cursor: "pointer",
        textDecoration: "none",
        transition: "color 0.3s",
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    formBox: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "100%",
        maxWidth: "400px",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        fontSize: "16px",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    switchText: {
        marginTop: "15px",
        fontSize: "14px",
    },
    linkButton: {
        background: "none",
        border: "none",
        color: "#007BFF",
        cursor: "pointer",
        fontSize: "14px",
        textDecoration: "underline",
    },
    error: {
        color: "red",
        marginBottom: "12px",
        fontSize: "14px",
    },
};

export default SignUp;
