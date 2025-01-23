import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ isAuthenticated }) {
	if (isAuthenticated === null) return <div>Cargando...</div>;
	return isAuthenticated ? <Navigate to='/dashboard' /> : <Outlet />;
}
