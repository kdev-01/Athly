const api = "http://localhost:8000";

export const login = async ({ username, password }) => {
	const response = await fetch(`${api}/users/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({ username, password }),
		credentials: "include",
	});

	if (!response.ok) {
		const result = await response.json();
		throw new Error(result.detail || "Credenciales incorrectas");
	}

	return response.json();
};

export const profileDashboard = async () => {
	const response = await fetch(`${api}/users/profile`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		const result = await response.json();
		throw new Error(
			result.detail || "Error al obtener el perfil del usuario",
		);
	}
};
