import React, { useState } from "react";
import "../App.css";
import { generateStory } from "../api"; // Import the API utility
import axios from "axios"; // Import axios for API calls
import CustomTags from "./CustomTags";
import "./StoryGenerator.css"; // New styles for tags

import { useEffect } from "react"; // Add useEffect to handle story fetching
import { useNavigate } from "react-router-dom"; // Import for navigation

import CustomDropdown from "./CustomDropdown";


const StoryGenerator = () => {
    const navigate = useNavigate(); // Initialize navigation

    const [tags, setTags] = useState([]);
    const [length, setLength] = useState("Medium");
    const [story, setStory] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasStories, setHasStories] = useState(false);
    const [saveMessage, setSaveMessage] = useState(""); // Save status message
    const [generatedTitle, setGeneratedTitle] = useState("");
    const [savedStories, setSavedStories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStory, setEditedStory] = useState("");
    const [currentStoryId, setCurrentStoryId] = useState(null); // Track the selected story_id
    const [isNewStory, setIsNewStory] = useState(false); // Track if it's a new story


    const options = [
        { label: "✏️ Short (250 words)", value: "Short" },
        { label: "📖 Medium (500 words)", value: "Medium" },
        { label: "📜 Full (1000 words)", value: "Full" },
    ];



    const handleTagsChange = (newTags) => {
        console.log("Received Tags in StoryGenerator:", newTags); // Debugging
        setTags(newTags);
    };

    const handleGenerateStory = async () => {
        setLoading(true);
        setStory("");
        setEditedStory("");
        setSaveMessage("");
        setIsNewStory(true); // ✅ Set the flag for a new story
    
        try {
            const response = await axios.post("http://localhost:5001/generate-story", {
                keywords: tags,
                length,
            });
    
            const { title, story } = response.data;
            setGeneratedTitle(title);
            setEditedStory(story);
        } catch (error) {
            setEditedStory("Error generating story.");
        } finally {
            setLoading(false);
        }
    };
    
    
    

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token
        window.location.href = "/login"; // Redirect to login page
    };

    const handleSaveStory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setSaveMessage("Please log in to save your story.");
                return;
            }
    
            if (isNewStory) {
                // ✅ Create a New Story and Add it to the List
                const response = await axios.post(
                    "http://localhost:5001/stories",
                    { title: generatedTitle, story: editedStory, keywords: tags, length },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                const newStory = {
                    story_id: response.data.story_id,
                    title: generatedTitle,
                    keywords: tags,
                };
    
                setSavedStories((prevStories) => [newStory, ...prevStories]); // ✅ Add new story to the list
                setCurrentStoryId(response.data.story_id);
                setIsNewStory(false);
                setSaveMessage("Story saved successfully!");
            } else {
                // ✅ Edit an Existing Story
                if (!currentStoryId) {
                    alert("No story selected for editing.");
                    return;
                }
    
                await axios.put(
                    `http://localhost:5001/stories/${currentStoryId}`,
                    { story: editedStory },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                setSaveMessage("Story updated successfully!");
            }
        } catch (error) {
            setSaveMessage("Failed to save the story.");
        }
    };
    
    
    

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to save your edits.");
                return;
            }
    
            const response = await axios.put(
                `http://localhost:5001/stories/${currentStoryId}`, // Use the correct story ID
                { story: editedStory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setStory(editedStory);
            setIsEditing(false);
            alert(response.data.message || "Story updated successfully!");
        } catch (error) {
            console.error("Error updating story:", error);
            alert("Failed to update story.");
        }
    };
    
    
    


    useEffect(() => {
        const fetchSavedStories = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
    
                const response = await axios.get("http://localhost:5001/stories", {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                console.log("Fetched Stories:", response.data); // Debugging
                
                setSavedStories(response.data);
            } catch (error) {
                console.error("Error fetching saved stories:", error);
            }
        };
    
        fetchSavedStories();
    }, []);
    
    
    
    
    const fetchFullStory = async (storyId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const response = await axios.get(`http://localhost:5001/stories/${storyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setCurrentStoryId(storyId);
            setGeneratedTitle(response.data.title);
            setEditedStory(response.data.story);
            setIsNewStory(false); // ✅ Now it's an existing story, not a new one
        } catch (error) {
            console.error("Error fetching story:", error);
        }
    };
    
    
    
    
    
    return (
        <div style={styles.container}>
            {/* Left Pane */}
            <div style={styles.leftPane}>
                <h2 style={styles.title} onClick={() => navigate("/")}>Story-Weaver</h2>
                <p style={styles.subtitle}>Enter keywords and select story length:</p>
                <CustomTags onTagsChange={handleTagsChange} />
                
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Select Story Length:</label>
                    <select
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={styles.select}
                    >
                        <option value="Short">Short</option>
                        <option value="Medium">Medium</option>
                        <option value="Full">Full</option>
                    </select>
                </div>
                <button
                    onClick={handleGenerateStory}
                    style={styles.button}
                    disabled={loading || tags.length === 0}
                >
                    {loading ? "Generating..." : "Generate Story"}
                </button>
                <div style={styles.savedStoriesContainer}>
                    <h2 style={styles.savedStoriesHeading}>Saved Stories</h2>
                    <div style={styles.savedStoriesList}>
                        {savedStories.map((story) => (
                            <div key={story.story_id} style={styles.storyItem} onClick={() => fetchFullStory(story.story_id)}>
                                <p style={styles.sideStoryTitle}>{story.title}</p>
                                <small>Tags: {story.keywords.join(", ")}</small>
                            </div>
                        ))}
                    </div>
                </div>






                <button style={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Right Pane */}
            <div style={styles.rightPane}>
                {editedStory ? (
                    <div style={styles.storyContainer}>
                        <div style={styles.storyHeader}>
                            <h2 style={styles.storyTitle}>{generatedTitle}</h2>
                        </div>

                        <textarea
                            value={editedStory}
                            onChange={(e) => setEditedStory(e.target.value)}
                            style={styles.storyTextarea}
                            placeholder="Start writing your story here..."
                        />

                        <div style={styles.saveButtonContainer}>
                        <button style={styles.saveButton} onClick={handleSaveStory}>
                            {isNewStory ? "Save New Story" : "Update Story"}
                        </button>
                        </div>
                    </div>
                ) : (
                    <p style={styles.placeholder}>Your story will appear here once generated or selected.</p>
                )}
            </div>




        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#FDF9F6", // Consistent background
        borderTop: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
    },
    leftPane: {
        flex: 1, // 1/3 of the width
        padding: "20px",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    rightPane: {
        flex: 2,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
    storyContainer: {
        backgroundColor: "#fff",
        borderRadius: "5px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
    },
    storyHeader: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "20px",
        paddingBottom: "10px",
    },
    storyTextarea: {
        width: "100%",
        flexGrow: 1, // ✅ Expands dynamically
        padding: "20px",
        fontSize: "18px",
        border: "none",
        outline: "none",
        resize: "none",
        minHeight: "450px", // ✅ Prevents textarea from being too short
        maxHeight: "75vh", // ✅ Ensures it doesn't take over the screen
        backgroundColor: "transparent",
    },
    saveButtonContainer: {
        display: "flex",
        justifyContent: "center",
        padding: "10px 0",
    },
    saveButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    
    storyText: {
        flexGrow: 1, // Takes up full height
        whiteSpace: "pre-wrap",
        lineHeight: "1.6",
        minHeight: "100%", // Always fills the right pane
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "10px",
        cursor: "pointer",
    },
    subtitle: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "20px",
    },
    inputContainer: {
        marginTop: "20px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    },
    select: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
    button: {
        padding: "10px",
        marginTop: "20px",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    
    storyTitle: {
        marginBottom: "10px",
        fontSize: "18px",
        fontWeight: "bold",
        paddingLeft : "20px"
    },
    placeholder: {
        fontSize: "16px",
        color: "#aaa",
        textAlign: "center",
        marginTop: "50px",
    },
    saveMessage: {
        marginTop: "10px",
        fontSize: "14px",
        color: "#28a745", // Green for success
        textAlign: "center",
    },
    sideStoryTitle: {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "5px",
        cursor: "pointer",
    },
    
    
    savedStoriesContainer: {
        position: "relative",
        marginTop: "20px",
        borderTop: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
        padding: "0", // Remove padding to avoid content shifting
        maxHeight: "450px", // Set height limit
        overflow: "hidden", // Prevent content from overflowing
        display: "flex",
        flexDirection: "column",
    },
    savedStoriesHeading: {
        position: "sticky",
        top: "0",
        backgroundColor: "#f9f9f9", // Match container background for seamless effect
        padding: "10px",
        fontWeight: "bold",
        fontSize: "20px",
        textAlign: "left",
        zIndex: "100",
        marginBottom: "0px",
    },
    savedStoriesList: {
        flexGrow: "1",
        overflowY: "auto", // Enable scrolling only inside this section
        padding: "10px", // Prevent text from touching the edges
        marginBottom: "10px",
    },
    storyItem: {
        padding: "10px",
        borderBottom: "1px solid #fff",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        backgroundColor: "#E9E9E9", // White background for each item
        paddingBottom: "16px",
    },
    storyItemHover: {
        backgroundColor: "#e9e9e9",
    },


    storyContainer: {
        backgroundColor: "#fff",
        borderRadius: "5px",
        padding: "15px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        position: "relative",
    },
    storyHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    editIcon: {
        cursor: "pointer",
        fontSize: "18px",
        color: "#007BFF",
    },

    logoutButton: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#e74c3c", // Red color for logout
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "20px",
        transition: "background 0.2s ease",
    },
    logoutButtonHover: {
        backgroundColor: "#c0392b", // Darker red when hovered
    },
    
    
    
    
};

export default StoryGenerator;
