import React, { useState, createContext, useEffect } from 'react';

// Create the context outside the component to ensure proper scope
export const StatusResponseContext = createContext();

const ChefContextApi = ({ children }) => {
    // State to hold the StatusResponse
    const [StatusResponse, setStatusResponse] = useState(null);

    // Log changes to StatusResponse
    useEffect(() => {
        console.log("Provider StatusResponse updated:", StatusResponse);
    }, [StatusResponse]);

    // Return the context provider wrapping children components
    return (
        <StatusResponseContext.Provider value={{ StatusResponse, setStatusResponse }}>
            {children}
        </StatusResponseContext.Provider>
    );
};

// Export the component as a default export
export default ChefContextApi;
