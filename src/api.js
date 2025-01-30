
// Generate a story based on keywords and length
export const generateStory = async (keywords, length) => {

    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

    try {
        console.log(keywords);
        
        const response = await fetch(`${API_BASE_URL}/generate-story`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                keywords,
                length,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate story");
        }

        const data = await response.json();
        return data.story;
    } catch (error) {
        console.error("Error in generateStory API:", error);
        throw error;
    }
};
