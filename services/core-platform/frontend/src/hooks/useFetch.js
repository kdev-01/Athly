import { useState } from "react";
import { postData, getData } from "../services/authService";

export const useFetch = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const postRequest = async (formData, route) => {
		setLoading(true);
		setError(null);

		try {
			const result = await postData(formData, route);
			setData(result.data);
			return result;
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const getRequest = async (route) => {
		setLoading(true);
		setError(null);

		try {
			const result = await getData(route);
			setData(result.data);
			return result;
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const updateRequest = async (id, formData, route) => {
		setLoading(true);
		setError(null);

		try {
			const result = await getData(id, formData, route);
			if (result.success) {
				setData(result.data);
			}
			return result;
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const deleteRequest = async (id, route) => {
		setLoading(true);
		setError(null);

		try {
			const result = await getData(id, route);
			if (result.success) {
				setData(result.data);
			}
			return result;
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return {
		data,
		loading,
		error,
		postRequest,
		getRequest,
		updateRequest,
		deleteRequest,
	};
};
