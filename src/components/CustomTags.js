import React, { useState } from "react";
import "./CustomTags.css";

const CustomTags = ({ onTagsChange }) => {
    const [tags, setTags] = useState([]);
    const [input, setInput] = useState("");

    const handleKeyUp = (event) => {
        if (event.key === "Enter" && input.trim() !== "") {
            setTags([...tags, input.trim()]);
            setInput("");
            if (onTagsChange) {
                onTagsChange([...tags, input.trim()]);
            }
        }
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        setTags(newTags);
        if (onTagsChange) {
            onTagsChange(newTags);
        }
    };

    return (
        <div className="tags-container-wrapper">
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type in something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyUp={handleKeyUp}
                />
            </div>
            <div className="tags-container">
                {tags.map((tag, index) => (
                    <div className="tag" key={index}>
                        {tag}
                        <span className="tag-close" onClick={() => removeTag(index)}>
                            &times;
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomTags;
