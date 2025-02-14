import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rejectionDescription } from "../schemas/student";
import { useFetch } from "../hooks/useFetch";
import { toast } from "sonner";
import Button from "./Button";

export default function RejectionDescription({ student, updateStudent }) {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(rejectionDescription),
		defaultValues: {
			description: "",
			selectedDocuments: [],
		},
	});

	const { postRequest } = useFetch();
	const selectedDocuments = watch("selectedDocuments");

	useEffect(() => {
		if (student) {
			reset({ description: "", selectedDocuments: [] });
		}
	}, [student, reset]);

	const handleCheckboxChange = (event) => {
		const { value, checked } = event.target;
		setValue(
			"selectedDocuments",
			checked
				? [...selectedDocuments, value]
				: selectedDocuments.filter((doc) => doc !== value),
		);
	};

	const submitFormData = (formData) => {
		const formattedDocs =
			formData.selectedDocuments.length > 0
				? `[${formData.selectedDocuments.join(", ")}] `
				: "";
		formData.description = `${formattedDocs}${formData.description}`;
		formData.identification = student.identification;
		formData.student_id = student.id;
		formData.id_event = student.event_id;
		formData.status = "Rechazado";

		toast("¿Está seguro/a de rechazar a este estudiante?", {
			action: {
				label: "Confirmar",
				onClick: () => {
					const response = postRequest(formData, "/student/status");
					toast.promise(response, {
						loading: "Cargando...",
						success: (data) => {
							if (data.success) {
								updateStudent(data.data);
								return data.message;
							}
							throw new Error(data.message);
						},
						error: (err) => err.message,
					});
				},
			},
		});
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(submitFormData)}
				className='flex flex-col gap-4'
			>
				<div className='flex gap-4 flex-wrap'>
					{["Foto", "Autorización", "Matrícula", "Cédula"].map(
						(option) => (
							<label
								key={option}
								className='flex items-center gap-2 cursor-pointer'
							>
								<input
									type='checkbox'
									value={option}
									checked={selectedDocuments.includes(option)}
									onChange={handleCheckboxChange}
									className='accent-blue-500'
								/>
								{option}
							</label>
						),
					)}
				</div>

				{errors.selectedDocuments && (
					<span className='text-red-500 text-xs'>
						{errors.selectedDocuments.message}
					</span>
				)}

				<label className='flex flex-col gap-1'>
					Motivo del rechazo
					<textarea
						id='description'
						{...register("description")}
						placeholder='Explica brevemente el motivo por el cual se está rechazando al estudiante.'
						className='p-2 border rounded-md'
						rows='4'
					/>
					{errors.description && (
						<span className='text-red-500 text-xs'>
							{errors.description.message}
						</span>
					)}
				</label>

				<Button type='submit' className='mt-4 w-full'>
					Confirmar rechazo
				</Button>
			</form>
		</>
	);
}
