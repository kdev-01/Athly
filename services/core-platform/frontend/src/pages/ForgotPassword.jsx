import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { userForgotPassword } from "../schemas/user";
import { useFetch } from "../hooks/useFetch";
import BackButton from "../components/BackButton";
import InputField from "../components/InputField";
import Button from "../components/Button";
import loginImage from "../assets/login.png";

export default function ForgotPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(userForgotPassword),
	});
	const navigate = useNavigate();
	const { loading, error, postRequest } = useFetch();
	const submitFormData = async (formData) => {
		const response = await postRequest(formData, "/user/forgot/password");
		if (error) {
			toast.error(error);
		}

		if (response?.success) {
			toast.success(response.detail);
			window.localStorage.setItem("email", formData.email);
			await new Promise((resolve) => setTimeout(resolve, 3000));
			navigate("/login");
		} else {
			toast.error(response?.detail);
			await new Promise((resolve) => setTimeout(resolve, 3000));
			navigate("/");
		}
	};

	return (
		<>
			<header className='absolute top-4 left-4'>
				<BackButton to='/login'>Login</BackButton>
			</header>

			<main className='grid grid-cols-2 h-screen overflow-hidden'>
				<section className='flex flex-col justify-center items-center p-10'>
					<h1 className='text-5xl font-extrabold text-center mb-16'>
						Recuperar contraseña
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

						<Button type='submit' className='mt-2'>
							{loading
								? "Enviando..."
								: "Enviar correo electrónico"}
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
