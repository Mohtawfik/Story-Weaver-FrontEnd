import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import StoryGenerator from "./components/StoryGenerator";
import ProtectedRoute from "./components/ProtectedRoute";

// Dynamically set basename for GitHub Pages
const basename = process.env.NODE_ENV === "production" ? "/Story-Weaver-FrontEnd" : "";

const App = () => {
    return (
        <Router basename={basename}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected Routes */}
                <Route
                    path="/story-generator"
                    element={
                        <ProtectedRoute>
                            <StoryGenerator />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
