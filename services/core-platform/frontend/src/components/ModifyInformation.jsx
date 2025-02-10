import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateAge } from "../utils/operationsDates";
import { getColorStatus } from "../utils/getStyles";
import { getDynamicSchema } from "../schemas/student";
import { useFetch } from "../hooks/useFetch";
import { toast } from "sonner";
import Button from "./Button";
import ProfileImage from "../assets/ProfileImage.png";
import BloodTypeIcon from "../components/Icons/BloodTypeIcon";
import TimeIcon from "../components/Icons/TimeIcon";
import BoyIcon from "../components/Icons/BoyIcon";
import WomanIcon from "../components/Icons/WomanIcon";

export default function ModifyInformation({ student }) {
	console.log(student);
	const extractInvalidDocuments = (description) => {
		const match = description.match(/^\[(.*?)\]\s*(.*)/);
		return {
			invalidDocs: match
				? match[1].split(", ").map((doc) => doc.trim())
				: [],
			cleanDescription: match ? match[2] : description,
		};
	};

	const { invalidDocs, cleanDescription } = extractInvalidDocuments(
		student.description,
	);

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(getDynamicSchema(invalidDocs)),
	});

	const { postRequest } = useFetch();
	const image = watch("photo");

	const onSubmit = (formData) => {
		const formDataToSend = new FormData();
		formDataToSend.append("student_id", student.id);
		formDataToSend.append("id_event", student.event_id);

		if (invalidDocs.includes("Foto") && formData.photo?.[0]) {
			formDataToSend.append("photo", formData.photo[0]);
		}

		if (
			invalidDocs.includes("Cédula") &&
			formData.copy_identification?.[0]
		) {
			formDataToSend.append(
				"copy_identification",
				formData.copy_identification[0],
			);
		}

		if (
			invalidDocs.includes("Autorización") &&
			formData.authorization?.[0]
		) {
			formDataToSend.append("authorization", formData.authorization[0]);
		}

		if (invalidDocs.includes("Matrícula") && formData.enrollment?.[0]) {
			formDataToSend.append("enrollment", formData.enrollment[0]);
		}

		toast("¿Está seguro/a que los documentos cargados son correctos?", {
			action: {
				label: "Confirmar",
				onClick: () => {
					const response = postRequest(
						formDataToSend,
						"/student/set/documents",
					);
					toast.promise(response, {
						loading: "Cargando...",
						success: (data) => {
							if (data.success) {
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
		<>
			<header className='flex flex-col p-5 bg-red-100 rounded-xl relative'>
				<h1 className='text-2xl font-bold'>{`${student.name} ${student.surname}`}</h1>

				<div className='flex gap-1 mt-3'>
					<p className='flex items-center p-[2px] pr-[8px] text-xs bg-white rounded-lg mr-1'>
						<TimeIcon className='p-1' />
						{calculateAge(student.date_birth)} años
					</p>

					<p className='flex items-center p-[2px] pr-[8px] text-xs bg-white rounded-lg mr-1'>
						<BloodTypeIcon className='p-1' />
						{student.blood_type}
					</p>

					<p className='flex items-center p-[2px] pr-[8px] text-xs bg-white rounded-lg mr-1'>
						{student.gender === 1 ? (
							<>
								<BoyIcon /> Masculino
							</>
						) : (
							<>
								<WomanIcon className='p-[2px]' /> Femenino
							</>
						)}
					</p>
				</div>

				<p className='bg-white mt-4 p-4 rounded-xl'>
					{cleanDescription}
				</p>

				<span
					className={`absolute right-6 p-2 rounded-xl text-xs font-extrabold ${getColorStatus(
						student.status,
					)}`}
				>
					{student.status}
				</span>
			</header>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='flex flex-col mt-5 p-5 bg-white rounded-xl'>
					<article className='flex flex-col items-center'>
						{invalidDocs.includes("Foto") && (
							<div className='flex flex-col items-center mb-6'>
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
						)}
					</article>

					<div className='flex flex-col gap-4'>
						{invalidDocs.includes("Cédula") && (
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
						)}

						{invalidDocs.includes("Autorización") && (
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
						)}

						{invalidDocs.includes("Matrícula") && (
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
						)}
					</div>
				</div>

				<Button type='submit' className='mt-7 w-full'>
					Guardar Cambios
				</Button>
			</form>
		</>
	);
}
