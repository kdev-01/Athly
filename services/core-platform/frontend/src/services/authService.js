const api = "http://localhost:8000";

export const postData = async (formData, route) => {
	const response = await fetch(api + route, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();
		return {
			success: false,
			detail: error.detail,
		};
	}

	const data = await response.json();
	return { success: true, detail: data.detail };
};

export const checkAuthentication = async () => {
	const response = await fetch(`${api}/verify/token`, {
		method: "GET",
		credentials: "include",
	});

	const result = await response.json();
	return result.authenticated || false;
};

export const profileDashboard = async () => {
	const response = await fetch(`${api}/profile`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		const result = await response.json();
		throw new Error(result.detail);
	}
};
