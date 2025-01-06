import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function SignIn() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.username)
			newErrors.username = "El correo electrónico es obligatorio";
		if (!formData.password)
			newErrors.password = "La contraseña es obligatoria";
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsSubmitting(true);

		try {
			await login(formData);
			navigate("/dashboard");
		} catch (error) {
			setErrors({ server: error.message });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<header>
				<h1>Inicio de Sesión</h1>
			</header>

			<main>
				<form onSubmit={handleSubmit}>
					<label>
						Correo electrónico
						<input
							type='text'
							id='username'
							name='username'
							value={formData.username}
							onChange={handleChange}
						/>
					</label>
					{errors.username && <span>{errors.username}</span>}

					<label>
						Contraseña
						<input
							type='password'
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
						/>
					</label>
					{errors.password && <span>{errors.password}</span>}

					{errors.server && <p>{errors.server}</p>}

					<a href='/passwordrecovery'>¿Olvidaste tu contraseña?</a>

					<button type='submit' disabled={isSubmitting}>
						{isSubmitting ? "Enviando..." : "Iniciar Sesión"}
					</button>
				</form>
			</main>
		</>
	);
}
