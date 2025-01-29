import React, { useState } from "react";
import "./CustomDropdown.css";

const CustomDropdown = ({ options, selected, onSelect }) => {
    const [visible, setVisible] = useState(false);

    const handleOptionClick = (value) => {
        onSelect(value);
        setVisible(false);
    };

    return (
        <div className={`drop ${visible ? "visible" : ""}`}>
            <div
                className={`option ${!selected ? "placeholder" : "active"}`}
                onClick={() => setVisible(!visible)}
            >
                {selected || "Choose Story Length"}
            </div>
            {options.map((option, index) => (
                <div
                    key={index}
                    className={`option ${selected === option.value ? "active" : ""}`}
                    onClick={() => handleOptionClick(option.value)}
                >
                    {option.label}
                </div>
            ))}
        </div>
    );
};

export default CustomDropdown;
