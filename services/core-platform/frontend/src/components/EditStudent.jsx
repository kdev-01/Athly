import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStudent } from "../schemas/student";
import { useFetch } from "../hooks/useFetch";
import { toast } from "sonner";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function EditStudent({ student }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateStudent),
		defaultValues: {
			identification: student?.identification || "",
			names: student?.name || "",
			surnames: student?.surname || "",
			gender: student?.gender,
			date_of_birth: student?.date_birth || "",
			blood_type: student?.blood_type || "",
		},
	});
	const { postRequest } = useFetch();

	useEffect(() => {
		if (student) {
			reset({
				identification: student.identification,
				names: student.name,
				surnames: student.surname,
				gender: student.gender,
				date_of_birth: student.date_birth,
				blood_type: student.blood_type,
			});
		}
	}, [student, reset]);

	const onSubmit = (formData) => {
		formData.gender = formData.gender === "1" ? "Masculino" : "Femenino";
		const date = new Date(formData.date_of_birth);
		formData.date_of_birth = date.toISOString().split("T")[0];
		formData.id_event = student.event_id;

		toast(
			"¿Está seguro/a de que desea modificar los datos del estudiante?",
			{
				action: {
					label: "Confirmar",
					onClick: () => {
						const response = postRequest(
							formData,
							"/student/update",
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
			},
		);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
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

					<InputField
						label='Fecha de nacimiento'
						type='date'
						id='date_of_birth'
						register={register}
						errors={errors}
					/>

					<label className='flex flex-col gap-1'>
						<span>Sexo</span>
						<select
							id='gender'
							{...register("gender")}
							className='p-2 border rounded-md'
							defaultValue=''
						>
							<option value='' disabled>
								Seleccione una opción
							</option>
							<option value='1'>Masculino</option>
							<option value='2'>Femenino</option>
						</select>
						{errors.gender && (
							<span className='text-red-500 text-xs'>
								{errors.gender.message}
							</span>
						)}
					</label>

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
				</section>

				<Button type='submit' className='mt-7 w-full'>
					Guardar Cambios
				</Button>
			</form>
		</>
	);
}
