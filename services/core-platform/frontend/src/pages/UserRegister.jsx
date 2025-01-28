import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { userRegistration } from "../schemas/user";
import { useFetch } from "../hooks/useFetch";
import BackButton from "../components/BackButton";
import InputField from "../components/InputField";
import Button from "../components/Button";
import profileImage from "../assets/profileImage.png";
import loginImage from "../assets/login.png";

export default function UserRegister() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		resolver: zodResolver(userRegistration),
	});

	const { loading, error, postRequest } = useFetch();
	const image = watch("photo");

	const submitFormData = async (formData) => {
		const email = window.localStorage.getItem("email");
		const formDataToSend = new FormData();

		formDataToSend.append("email", email);
		formDataToSend.append("first_name", formData.first_name);
		formDataToSend.append("last_name", formData.last_name);
		formDataToSend.append("phone", formData.phone);

		if (formData.photo?.[0]) {
			formDataToSend.append("photo", formData.photo[0]);
		}

		const response = await postRequest(
			formDataToSend,
			"/user/register/data",
		);
		if (error) {
			toast.error(error);
		}

		if (response.success) {
			window.location.href = "/reset/password";
		} else {
			toast.error(response.message);
		}
	};

	return (
		<>
			<header className='absolute top-4 left-4'>
				<BackButton to='/login'>Regresar</BackButton>
			</header>

			<main className='grid grid-cols-2 h-screen overflow-hidden'>
				<section className='flex flex-col justify-center items-center p-10'>
					<h1 className='text-4xl font-extrabold text-center mb-16'>
						Registro de datos
					</h1>
					<form
						onSubmit={handleSubmit(submitFormData)}
						className='flex flex-col gap-6 w-full max-w-md'
					>
						<div className='flex flex-col items-center'>
							<img
								src={
									image?.[0]
										? URL.createObjectURL(image[0])
										: profileImage
								}
								alt='Vista previa de foto'
								className='w-20 h-20 rounded-full object-cover mb-3 border'
							/>
							<label className='cursor-pointer'>
								<span className='hover:underline'>
									Cargar foto
								</span>
								<input
									type='file'
									accept='image/*'
									className='hidden'
									{...register("photo")}
								/>
							</label>
							{errors.photo && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.photo.message}
								</p>
							)}
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<InputField
								label='Nombre'
								type='text'
								id='first_name'
								register={register}
								errors={errors}
							/>
							<InputField
								label='Apellido'
								type='text'
								id='last_name'
								register={register}
								errors={errors}
							/>
						</div>

						<InputField
							label='Número de Teléfono'
							type='tel'
							id='phone'
							register={register}
							errors={errors}
						/>

						<Button type='submit'>
							{loading ? "Enviando..." : "Enviar"}
						</Button>
					</form>
				</section>

				<section className='flex justify-center items-center h-full w-full'>
					<img
						src={loginImage}
						alt='Imagen genérica'
						className='w-full h-full object-cover'
					/>
				</section>
			</main>

			<Toaster position='top-right' />
		</>
	);
}
