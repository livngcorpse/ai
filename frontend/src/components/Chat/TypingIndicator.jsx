//frontend/src/components/Chat/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = () => {
    return (
        <div className="flex items-center space-x-1 p-2">
            <span className="typing-animation"></span>
            <span className="typing-animation"></span>
            <span className="typing-animation"></span>
        </div>
    );
};

export default TypingIndicator;