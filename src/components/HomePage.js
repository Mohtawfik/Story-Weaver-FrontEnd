import React, { useState, useEffect } from "react";
import "./HomePage.css";


import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const words = ["Create", "Edit", "Save"]; // Words to cycle through

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 2000); // Change word every 2 seconds
        return () => clearInterval(interval);
    }, []);

    const navigate = useNavigate();
    
    const handleGenerate = () => {
        navigate("/story-generator");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="home-page">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-left">Story-Weaver</div>
                <div className="navbar-right">
                    <button className="login-button" onClick={handleLogin}>Login</button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">
                Weave Your Stories and Ideas Using AI{" "}
                    <br/>
                    <span className="rotating-word">{words[currentWordIndex]}</span>
                </h1>
                <p className="hero-subtitle">
                    Transform your imagination into captivating stories with ease.
                </p>
                <button className="button" onClick={handleGenerate}>
                    GENERATE
                </button>
            </div>

            {/* Image Section */}
            <div className="curved-container">
                <img
                    src={`${process.env.PUBLIC_URL}/images/story-weaver-sample.png`} // Replace with your image path
                    alt="Illustration"
                    className="curved-image"
                />
            </div>
        </div>
    );
};

export default HomePage;
