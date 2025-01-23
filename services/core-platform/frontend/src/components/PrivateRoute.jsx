import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ isAuthenticated }) {
	if (isAuthenticated === null) return <div>Cargando...</div>;
	return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
}
