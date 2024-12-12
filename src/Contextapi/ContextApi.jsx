import React, { useState, createContext } from 'react';

export const getItemResponseContext = createContext();
export const editItemResponseContext = createContext();




function ContextApi({ children }) {
    const [getResponse, setGetResponse] = useState("");
    const [editResponse, setEditResponse] = useState("");


    return (
        <getItemResponseContext.Provider value={{ getResponse, setGetResponse }}>
            <editItemResponseContext.Provider value={{ editResponse, setEditResponse }}>
                {children}
            </editItemResponseContext.Provider>
        </getItemResponseContext.Provider>
    );
}

export default ContextApi;
