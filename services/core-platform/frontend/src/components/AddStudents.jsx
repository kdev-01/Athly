import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { addStudent } from "../schemas/student";
import { useFetch } from "../hooks/useFetch";
import { formattedDate } from "../utils/operationsDates";
import { getColorTitle } from "../utils/getStyles";
import InputField from "../components/InputField";
import ScrollableMenu from "./ScrollableMenu";
import Button from "../components/Button";
import ProfileImage from "../assets/ProfileImage.png";

export default function AddStudents({ data }) {
	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(addStudent),
	});
	const titleColor = getColorTitle(data.sport.name);
	const { postRequest } = useFetch();
	const image = watch("photo");

	const submitFormData = async (formData) => {
		const formDataToSend = new FormData();

		formDataToSend.append("photo", formData.photo[0]);
		formDataToSend.append("identification", formData.identification);
		formDataToSend.append("names", formData.names);
		formDataToSend.append("surnames", formData.surnames);
		formDataToSend.append("gender", formData.gender);
		const date = new Date(formData.date_of_birth);
		const formattedDate = date.toISOString().split("T")[0];
		formDataToSend.append("date_of_birth", formattedDate);
		formDataToSend.append("blood_type", formData.blood_type);
		formDataToSend.append("event_id", data.event_id);
		formDataToSend.append(
			"copy_identification",
			formData.copy_identification[0],
		);
		formDataToSend.append("authorization", formData.authorization[0]);
		formDataToSend.append("enrollment", formData.enrollment[0]);

		toast("¿Está seguro de inscribir al estudiante?", {
			action: {
				label: "Confirmar",
				onClick: () => {
					const response = postRequest(
						formDataToSend,
						"/student/load",
					);
					toast.promise(response, {
						loading: "Cargando...",
						success: (data) => {
							if (data.success) {
								reset();
								return data.message;
							}

							throw new Error(data.message);
						},
						error: (err) => {
							return err.message;
						},
					});
				},
			},
		});
	};

	return (
		<section>
			<header className='flex flex-col mt-5 p-5 bg-neutral-100 rounded-xl'>
				<h1 className='text-2xl font-bold'>Evento</h1>

				<section className='flex gap-12 mt-2'>
					<div className='text-xs'>
						<h2 className={`text-sm font-medium ${titleColor}`}>
							{data.name}
						</h2>
						{`${data.sport.name} - ${data.category.name}`}
					</div>

					<div className='text-xs'>
						<h2 className={`font-medium text-sm ${titleColor}`}>
							Inscripciones
						</h2>
						{formattedDate("custom", data.registration_start_date)}
						{" - "}
						{formattedDate("custom", data.registration_end_date)}
					</div>

					<div className='text-xs'>
						<h2 className={`font-medium text-sm ${titleColor}`}>
							Duración del evento
						</h2>
						{formattedDate("custom", data.start_date)}
						{" - "}
						{formattedDate("custom", data.end_date)}
					</div>

					{data.sport.name !== "Atletismo" &&
						data.sport.name !== "Ajedrez" && (
							<>
								<div className='text-xs'>
									<h2
										className={`font-medium text-sm ${titleColor}`}
									>
										Max. jugadores
									</h2>
									{data.sport.name === "Fútbol" ? "15" : "12"}
								</div>

								<div className='text-xs'>
									<h2
										className={`font-medium text-sm ${titleColor}`}
									>
										Min. jugadores
									</h2>
									{data.sport.name === "Fútbol" ? "11" : "5"}
								</div>
							</>
						)}
				</section>
			</header>

			<main className='mt-10'>
				<form
					onSubmit={handleSubmit(submitFormData)}
					className='rounded-lg'
				>
					<article className='flex flex-col items-center mb-4'>
						<img
							src={
								image?.[0]
									? URL.createObjectURL(image[0])
									: ProfileImage
							}
							alt='Vista previa de foto'
							className='w-20 h-20 rounded-full object-cover mb-3 border'
						/>
						<label className='cursor-pointer'>
							<span className='hover:underline'>Cargar foto</span>
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
					</article>

					<section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<InputField
							label='Número de cédula'
							type='text'
							id='identification'
							placeholder='0503959447'
							register={register}
							errors={errors}
						/>

						<InputField
							label='Nombres'
							type='text'
							id='names'
							placeholder='Kevin'
							register={register}
							errors={errors}
						/>

						<InputField
							label='Apellidos'
							type='text'
							id='surnames'
							placeholder='Tapia'
							register={register}
							errors={errors}
						/>

						<ScrollableMenu
							label='Sexo'
							id='gender'
							register={register}
							errors={errors}
							endpoint={"/gender/get"}
						/>

						<InputField
							label='Fecha de nacimiento'
							type='date'
							id='date_of_birth'
							register={register}
							errors={errors}
						/>

						<label className='flex flex-col gap-1'>
							<span>Tipo de sangre</span>
							<select
								id='blood_type'
								{...register("blood_type")}
								className='p-2 border rounded-md'
								defaultValue=''
							>
								<option value='' disabled>
									Seleccione una opción
								</option>
								<option value='A+'>A+</option>
								<option value='A-'>A-</option>
								<option value='B+'>B+</option>
								<option value='B-'>B-</option>
								<option value='AB+'>AB+</option>
								<option value='AB-'>AB-</option>
								<option value='O+'>O+</option>
								<option value='O-'>O-</option>
							</select>
							{errors.blood_type && (
								<span className='text-red-500 text-xs'>
									{errors.blood_type.message}
								</span>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							<span>Subir copia de cédula</span>
							<input
								type='file'
								accept='application/pdf'
								className='p-2 text-xs bg-white border rounded-md'
								{...register("copy_identification")}
							/>
							{errors.copy_identification && (
								<span className='text-red-500 text-xs'>
									{errors.copy_identification.message}
								</span>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							<span>Subir autorización firmada</span>
							<input
								type='file'
								accept='application/pdf'
								className='p-2 text-xs bg-white border rounded-md'
								{...register("authorization")}
							/>
							{errors.authorization && (
								<span className='text-red-500 text-xs'>
									{errors.authorization.message}
								</span>
							)}
						</label>

						<label className='flex flex-col gap-1'>
							<span>Subir matrícula actual</span>
							<input
								type='file'
								accept='application/pdf'
								className='p-2 text-xs bg-white border rounded-md'
								{...register("enrollment")}
							/>
							{errors.enrollment && (
								<span className='text-red-500 text-xs'>
									{errors.enrollment.message}
								</span>
							)}
						</label>
					</section>
					<Button type='submit' className='mt-11 w-full'>
						Enviar
					</Button>
				</form>
			</main>

			<Toaster position='top-right' />
		</section>
	);
}
