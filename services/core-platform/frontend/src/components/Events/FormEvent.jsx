import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const FormEvent = ({ onEventCreated, eventToEdit }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const [sports, setSports] = React.useState([]);
	const [categories, setCategories] = React.useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/sports/")
			.then((response) => setSports(response.data))
			.catch((error) =>
				console.error("Error al cargar los deportes:", error),
			);

		axios
			.get("http://localhost:8000/api/categories/")
			.then((response) => setCategories(response.data))
			.catch((error) =>
				console.error("Error al cargar las categorías:", error),
			);
	}, []);

	useEffect(() => {
		if (eventToEdit) {
			Object.keys(eventToEdit).forEach((key) => {
				setValue(key, eventToEdit[key]);
			});
		}
	}, [eventToEdit, setValue]);

	const onSubmit = (data) => {
		if (eventToEdit) {
			axios
				.put(
					`http://localhost:8000/api/events/${eventToEdit.event_id}/`,
					data,
				)
				.then(() => {
					alert("Evento actualizado exitosamente.");
					onEventCreated();
				})
				.catch((error) => {});
		} else {
			axios
				.post("http://localhost:8000/api/events/", data)
				.then(() => {
					alert("Evento creado exitosamente.");
					onEventCreated();
				})
				.catch((error) => {});
		}
	};

	return (
		<div className=' p-6'>
			{/* Barra negra superior */}
			<div className='text-center font-bold py-3'>
				{eventToEdit ? "Editar Evento" : "Crear Evento"}
			</div>

			{/* Contenido del formulario */}
			<form onSubmit={handleSubmit(onSubmit)} className=' p-6 space-y-6'>
				{/* Nombre del Evento */}
				<div>
					<label className='block text-gray-700 font-semibold'>
						Nombre del Evento:
					</label>
					<input
						type='text'
						{...register("name", {
							required: "El nombre es obligatorio",
						})}
						className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
					{errors.name && (
						<p className='text-red-500 text-sm'>
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Fechas */}
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-gray-700 font-semibold'>
							Fecha de Inicio:
						</label>
						<input
							type='date'
							{...register("start_date", {
								required: "La fecha de inicio es obligatoria",
							})}
							className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
						/>
						{errors.start_date && (
							<p className='text-red-500 text-sm'>
								{errors.start_date.message}
							</p>
						)}
					</div>
					<div>
						<label className='block text-gray-700 font-semibold'>
							Fecha de Fin:
						</label>
						<input
							type='date'
							{...register("end_date", {
								required: "La fecha de fin es obligatoria",
							})}
							className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
						/>
						{errors.end_date && (
							<p className='text-red-500 text-sm'>
								{errors.end_date.message}
							</p>
						)}
					</div>
				</div>

				{/* Inscripciones */}
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-gray-700 font-semibold'>
							Inicio de Inscripciones:
						</label>
						<input
							type='date'
							{...register("registration_start_date", {
								required:
									"La fecha de inicio de inscripciones es obligatoria",
							})}
							className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
						/>
						{errors.registration_start_date && (
							<p className='text-red-500 text-sm'>
								{errors.registration_start_date.message}
							</p>
						)}
					</div>
					<div>
						<label className='block text-gray-700 font-semibold'>
							Fin de Inscripciones:
						</label>
						<input
							type='date'
							{...register("registration_end_date", {
								required:
									"La fecha de fin de inscripciones es obligatoria",
							})}
							className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
						/>
						{errors.registration_end_date && (
							<p className='text-red-500 text-sm'>
								{errors.registration_end_date.message}
							</p>
						)}
					</div>
				</div>

				{/* Deporte */}
				<div>
					<label className='block text-gray-700 font-semibold'>
						Deporte:
					</label>
					<select
						{...register("sport_id", {
							required: "El deporte es obligatorio",
						})}
						className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
					>
						<option value=''>Selecciona un deporte</option>
						{sports.map((sport) => (
							<option key={sport.sport_id} value={sport.sport_id}>
								{sport.name}
							</option>
						))}
					</select>
					{errors.sport_id && (
						<p className='text-red-500 text-sm'>
							{errors.sport_id.message}
						</p>
					)}
				</div>

				{/* Categoría */}
				<div>
					<label className='block text-gray-700 font-semibold'>
						Categoría:
					</label>
					<select
						{...register("category_id", {
							required: "La categoría es obligatoria",
						})}
						className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
					>
						<option value=''>Selecciona una categoría</option>
						{categories.map((category) => (
							<option
								key={category.category_id}
								value={category.category_id}
							>
								{category.name}
							</option>
						))}
					</select>
					{errors.category_id && (
						<p className='text-red-500 text-sm'>
							{errors.category_id.message}
						</p>
					)}
				</div>

				{/* Botón de Enviar */}
				<button
					type='submit'
					className='w-full bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600'
				>
					{eventToEdit ? "Actualizar Evento" : "Crear Evento"}
				</button>
			</form>
		</div>
	);
};

export default FormEvent;
