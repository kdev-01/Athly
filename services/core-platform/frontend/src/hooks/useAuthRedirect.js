import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "../services/authService";

export function useAuthRedirect(redirectPath = "/dashboard") {
	const navigate = useNavigate();
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const isAuthenticated = await checkAuthentication();
				if (isAuthenticated) {
					navigate(redirectPath);
				}
			} catch (err) {
				setError(
					"Hubo un problema al verificar la autenticación. Intenta nuevamente.",
				);
			}
		};

		checkAuth();
	}, [navigate, redirectPath]);

	return { error };
}
