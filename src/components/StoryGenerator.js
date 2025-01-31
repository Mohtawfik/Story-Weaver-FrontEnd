import React, { useState } from "react";
import "../App.css";
import axios from "axios"; // Import axios for API calls
import CustomTags from "./CustomTags";
import "./StoryGenerator.css"; // New styles for tags
import { BiLogOut } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";


import { useEffect } from "react"; // Add useEffect to handle story fetching
import { useNavigate } from "react-router-dom"; // Import for navigation


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";



const StoryGenerator = () => {
    const navigate = useNavigate(); // Initialize navigation


    const [tags, setTags] = useState([]);
    const [length, setLength] = useState("Medium");
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
        setTags(newTags);
    };

    const handleGenerateStory = async () => {
        setLoading(true);
        setEditedStory("");
        setSaveMessage("");
        setIsNewStory(true); // ✅ Set the flag for a new story
    
        try {
            const response = await axios.post(`${API_BASE_URL}/generate-story`, {
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
        
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem("token"); // Clear the token
            navigate("/login");
        }
    };

    const handleSaveStory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to save your story.");
                navigate("/login");
                return;
            }
    
            if (isNewStory) {
                // ✅ Create a New Story and Add it to the List
                const response = await axios.post(
                    `${API_BASE_URL}/stories`,
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
                alert("Story saved successfully!");
            } else {
                // ✅ Edit an Existing Story
                if (!currentStoryId) {
                    alert("No story selected for editing.");
                    return;
                }
    
                await axios.put(
                    `${API_BASE_URL}/stories/${currentStoryId}`,
                    { story: editedStory },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                alert("Story updated successfully!");
            }
        } catch (error) {
            alert("Failed to save the story.");
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
                `${API_BASE_URL}/stories/${currentStoryId}`, // Use the correct story ID
                { story: editedStory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setEditedStory(editedStory);
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
    
                const response = await axios.get(`${API_BASE_URL}/stories`, {
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
    
            const response = await axios.get(`${API_BASE_URL}/stories/${storyId}`, {
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

    const handleDeleteStory = async (storyId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this story?");
        if (!confirmDelete) return;
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to delete stories.");
                return;
            }
    
            await axios.delete(`${API_BASE_URL}/stories/${storyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Remove the deleted story from the frontend list
            setSavedStories((prevStories) => prevStories.filter(story => story.story_id !== storyId));
    
            alert("Story deleted successfully!");
        } catch (error) {
            console.error("Error deleting story:", error);
            alert("Failed to delete the story.");
        }
    };
    
    
    
    
    
    
    return (
        <div style={styles.container}>
            {/* Left Pane */}
            <div style={styles.leftPane}>
                {/* <h2 style={styles.title} onClick={() => navigate("/")}>Story-Weaver</h2> */}
                <div style={styles.header}>
                    <h2 style={styles.title} onClick={() => navigate("/")}>Story-Weaver</h2>
                    <span style={styles.logoutIcon} onClick={handleLogout} title="Logout">
                        <BiLogOut size={24} />
                    </span>
                </div>
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
                { savedStories.length > 0 && (
                    <div style={styles.savedStoriesContainer}>
                    <h2 style={styles.savedStoriesHeading}>Saved Stories</h2>
                    <div style={styles.savedStoriesList}>
                        {savedStories.map((story) => (
                            // <div key={story.story_id} style={styles.storyItem} onClick={() => fetchFullStory(story.story_id)}>
                            //     <p style={styles.sideStoryTitle}>{story.title}</p>
                            //     <small>Tags: {story.keywords.join(", ")}</small>
                            //     <span 
                            //         style={styles.deleteIcon} 
                            //         onClick={() => handleDeleteStory(story.story_id)}
                            //     >
                            //         🗑️
                            //     </span>
                            // </div>
                            <div key={story.story_id} style={styles.storyItem}>
                                <div onClick={() => fetchFullStory(story.story_id)}>
                                    <p style={styles.sideStoryTitle}>{story.title}</p>
                                    <small>Tags: {story.keywords.join(", ")}</small>
                                </div>
                                <span 
                                    style={styles.deleteIcon} 
                                    onClick={() => handleDeleteStory(story.story_id)}
                                >
                                    <RiDeleteBin5Fill size={24}/>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                ) }
                






                {/* <div style={styles.logoutContainer}>
                    <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
                </div> */}
            </div>

            {/* Right Pane */}
            <div style={styles.rightPane}>
                {editedStory ? (
                    <div style={styles.storyContainer}>
                        <div style={styles.storyHeader}>
                            <h2 style={styles.storyTitle}>{generatedTitle}</h2>
                            <span style={styles.saveButtonContainer}>
                                <button style={styles.saveButton} onClick={handleSaveStory}>
                                    {isNewStory ? "Save New Story" : "Update Story"}
                                </button>
                            </span>
                        </div>

                        <textarea
                            value={editedStory}
                            onChange={(e) => setEditedStory(e.target.value)}
                            style={styles.storyTextarea}
                            placeholder="Start writing your story here..."
                        />

                        {/* <div style={styles.saveButtonContainer}>
                            <button style={styles.saveButton} onClick={handleSaveStory}>
                                {isNewStory ? "Save New Story" : "Update Story"}
                            </button>
                        </div> */}
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
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FDF9F6",
    },
    leftPane: {
        flex: 1.1, // 1/3 of the width
        padding: "20px",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    rightPane: {
        flex: 3,
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
        minHeight: "480px", // ✅ Prevents textarea from being too short
        maxHeight: "75vh", // ✅ Ensures it doesn't take over the screen
        backgroundColor: "transparent",
    },
    saveButtonContainer: {
        display: "flex",
        justifyContent: "right",
        padding: "10px 0",
    },
    saveButton: {
        padding: "12px",
        backgroundColor: "#797679",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    logoutContainer: {
        marginTop: "auto", // ✅ Pushes logout button to the bottom
        paddingTop: "20px", // Adds spacing above the button
    },

    storyItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // ✅ Pushes the delete icon to the extreme right
        padding: "10px",
        borderBottom: "1px solid #fff",
        borderRadius: "9px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        backgroundColor: "#EFEEEE",
        paddingBottom: "16px",
    },
    deleteIcon: {
        fontSize: "10px",
        color: "black",
        cursor: "pointer",
        marginLeft: "auto", // ✅ Pushes the delete icon to the extreme right
        transition: "color 0.2s ease",
    },
    deleteIconHover: {
        color: "#ff4d4d",
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
        cursor: "pointer",
    },
    logoutIcon: {
        fontSize: "24px",
        cursor: "pointer",
        transition: "color 0.2s, transform 0.2s",
    },
    logoutIconHover: {
        color: "#ff4d4d", // Red color on hover
        transform: "translateX(-3px)", // Moves left slightly on hover
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
        border: "2px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f8f8f8",
    },
    button: {
        padding: "10px",
        marginTop: "20px",
        backgroundColor: "#797679",
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
        marginRight: "20px",
        cursor: "pointer",
    },
    
    
    savedStoriesContainer: {
        position: "relative",
        marginTop: "20px",
        borderTop: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
        padding: "0", // Remove padding to avoid content shifting
        maxHeight: "550px", // Set height limit
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
    // storyItem: {
    //     padding: "10px",
    //     borderBottom: "1px solid #fff",
    //     borderRadius: "9px",
    //     cursor: "pointer",
    //     transition: "background-color 0.2s ease",
    //     backgroundColor: "#EFEEEE",
    //     paddingBottom: "16px",
    // },
    storyItemHover: {
        backgroundColor: "#e9e9e9",
    },


    storyContainer: {
        backgroundColor: "#f4f0f0",
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
        backgroundColor: "#9A6E69", // Red color for logout
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
