import { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem("userRole") || null);

    useEffect(() => {
        const handleStorageChange = () => {
            const newRole = localStorage.getItem("userRole");
            if (newRole !== role) {
                setRole(newRole);
            }
        };

        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);

        // Also check for changes on focus (in case localStorage was changed in another tab)
        window.addEventListener('focus', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
        };
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({ role, setRole }), [role]);

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};