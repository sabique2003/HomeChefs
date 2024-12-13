import React, { useState, createContext, useEffect } from 'react';

export const StatusResponseContext = createContext();

const ChefContextApi = ({ children }) => {
    const [StatusResponse, setStatusResponse] = useState(null);

    useEffect(() => {
        console.log("Provider StatusResponse updated:", StatusResponse);
    }, [StatusResponse]);

    return (
        <StatusResponseContext.Provider value={{ StatusResponse, setStatusResponse }}>
            {children}
        </StatusResponseContext.Provider>
    );
};

export default ChefContextApi;
