import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { userRecoverPassword } from "../schemas/user";
import { useFetch } from "../hooks/useFetch";
import BackButton from "../components/BackButton";
import InputField from "../components/InputField";
import Button from "../components/Button";
import loginImage from "../assets/login.png";

export default function RecoverPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(userRecoverPassword),
	});
	const { loading, error, postRequest } = useFetch();

	const submitFormData = async (formData) => {
		const email = window.localStorage.getItem("email");
		formData.email = email;
		const response = await postRequest(formData, "/user/reset/password");
		if (error) {
			toast.error(error);
		}

		if (response.success) {
			toast.success(response.message);
			localStorage.removeItem("email");
			await new Promise((resolve) => setTimeout(resolve, 3000));
			window.location.href = "/login";
		} else {
			toast.error(response.message);
		}
	};

	return (
		<>
			<header className='absolute top-4 left-4'>
				<BackButton to='/login'>Salir</BackButton>
			</header>

			<main className='grid grid-cols-2 h-screen overflow-hidden'>
				<section className='flex flex-col justify-center items-center p-10'>
					<h1 className='text-5xl font-extrabold text-center mb-16'>
						Cambio de contraseña
					</h1>
					<form
						onSubmit={handleSubmit(submitFormData)}
						className='flex flex-col gap-6 w-full max-w-md'
					>
						<InputField
							label='Contraseña temporal'
							type='password'
							id='temporaryPassword'
							register={register}
							errors={errors}
						/>

						<InputField
							label='Contraseña nueva'
							type='password'
							id='newPassword'
							register={register}
							errors={errors}
						/>

						<InputField
							label='Confirmar contraseña'
							type='password'
							id='confirmPassword'
							register={register}
							errors={errors}
						/>

						<Button type='submit' className='mt-6'>
							{loading ? "Enviando..." : "Cambiar"}
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
			</main>

			<Toaster position='top-right' />
		</>
	);
}
