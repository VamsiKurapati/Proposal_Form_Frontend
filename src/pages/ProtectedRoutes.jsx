import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const [role, setRole] = useState(localStorage.getItem("role") || null);

    useEffect(() => {
        const role = localStorage.getItem("role") || null;
        setRole(role);
    }, []);

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoutes;