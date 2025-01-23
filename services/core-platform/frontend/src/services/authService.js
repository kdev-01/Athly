const api = "http://localhost:8000";

export const postData = async (formData, route) => {
	const isFormData = formData instanceof FormData;
	const response = await fetch(api + route, {
		method: "POST",
		headers: isFormData
			? undefined
			: {
					"Content-Type": "application/json",
				},
		body: isFormData ? formData : JSON.stringify(formData),
		credentials: "include",
	});

	const data = await response.json();
	return data;
};

export const getData = async (route) => {
	const response = await fetch(api + route, {
		method: "GET",
		credentials: "include",
	});

	const data = await response.json();
	return data;
};

export const updateData = async (id, formData, route) => {
	const response = await fetch(`${api}${route}/?id=${id}`, {
		method: "PUT",
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

export const deleteData = async (id, route) => {
	const response = await fetch(`${api}${route}/?id=${id}`, {
		method: "DELETE",
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
