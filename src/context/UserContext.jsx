import { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem("userRole") || "");

    useEffect(() => {
        setRole(localStorage.getItem("userRole"));
    }, [localStorage.getItem("userRole")]);

    return <UserContext.Provider value={{ role, setRole }}>{children}</UserContext.Provider>;
};