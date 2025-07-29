import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const { role } = useUser();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoutes;