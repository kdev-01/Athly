import { useState } from "react";
import { postData } from "../services/authService";

export const useFetch = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	const postRequest = async (formData, route) => {
		setLoading(true);
		setError(null);

		try {
			const newRequest = await postData(formData, route);
			setData(newRequest);
			return newRequest;
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, postRequest };
};
