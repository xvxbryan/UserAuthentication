import React from "react";

interface WrapperProps {
    children: React.ReactNode;
}

const LogRegBackground: React.FC<WrapperProps> = ({ children }) => {
    return (
        <div
            className="flex flex-col"
            style={{ height: "calc(100vh - 59.98px)" }}
        >
            <div className="flex-grow flex items-center justify-center bg-gray-200">
                <div className="bg-white p-8 rounded-lg shadow-md min-w-60 w-1/2 max-w-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default LogRegBackground;
