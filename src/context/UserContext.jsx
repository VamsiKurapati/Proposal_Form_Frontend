import { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role) {
            setRole(role);
        }
    }, []);

    return <UserContext.Provider value={{ role, setRole }}>{children}</UserContext.Provider>;
};