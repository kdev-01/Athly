import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { userLogin } from "../schemas/user";
import { useFetch } from "../hooks/useFetch";
//import { useAuthRedirect } from "../hooks/useAuthRedirect";
import BackButton from "../components/BackButton";
import InputField from "../components/InputField";
import Button from "../components/Button";
import loginImage from "../assets/login.png";

export default function SignIn() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(userLogin),
	});
	const navigate = useNavigate();
	//const { error: authError } = useAuthRedirect();
	const { loading, error, postRequest } = useFetch();
	const submitFormData = async (formData) => {
		const response = await postRequest(formData, "/user/login");
		if (error) {
			toast.error(error);
		}

		if (response?.success) {
			navigate("/dashboard");
		} else {
			if (response?.detail === "Cambio requerido.") {
				navigate("/reset/password");
				return;
			}

			toast.error(response?.detail /*[0].msg*/);
		}
	};

	return (
		<>
			<header className='absolute top-4 left-4'>
				<BackButton to='/'>Regresar</BackButton>
			</header>

			<main className='grid grid-cols-2 h-screen overflow-hidden'>
				<section className='flex flex-col justify-center items-center p-10'>
					<h1 className='text-5xl font-extrabold text-center mb-16'>
						Inicio de sesión
					</h1>
					<form
						onSubmit={handleSubmit(submitFormData)}
						className='flex flex-col gap-6 w-full max-w-md'
					>
						<InputField
							label='Correo electrónico'
							type='text'
							id='email'
							register={register}
							errors={errors}
						/>
						<InputField
							label='Contraseña'
							type='password'
							id='password'
							register={register}
							errors={errors}
						/>

						<a href='/forgot/password' className='hover:underline'>
							¿Olvidaste tu contraseña?
						</a>

						<Button type='submit'>
							{loading ? "Enviando..." : "Ingresar"}
						</Button>
					</form>
				</section>

				<section className='flex justify-center items-center h-full w-full'>
					<img
						src={loginImage}
						alt='Cancha de fútbol'
						className='w-full h-full object-cover'
					/>
				</section>

				<Toaster position='top-right' />
			</main>
		</>
	);
}