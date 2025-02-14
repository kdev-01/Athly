import React, { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from "../Icons/EditIcon";

function WorkShop({ event }) {
	const [workshop, setWorkshop] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [workshopToEdit, setWorkshopToEdit] = useState(null);
	const [newWorkshopData, setNewWorkshopData] = useState({
		name: "",
		location: "",
		date_time: "",
		description: "",
		event_id: event.event_id, // Incluye el event_id en los datos del congresillo
	});

	useEffect(() => {
		// Carga los datos del congresillo técnico
		axios
			.get("http://localhost:8000/api/workshops")
			.then((response) => {
				const relatedWorkshop = response.data.find(
					(ws) => ws.event_id === event.event_id,
				);
				setWorkshop(relatedWorkshop);
			})
			.catch((error) =>
				console.error("Error al cargar congresillos:", error),
			);
	}, [event.event_id]);

	const handleCreateWorkshop = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleInputChange = (event) => {
		setNewWorkshopData({
			...newWorkshopData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setIsCreating(true);

		const url = isEditing
			? `http://localhost:8000/api/workshops/${workshopToEdit.workshop_id}`
			: "http://localhost:8000/api/workshops";
		const method = isEditing ? "PUT" : "POST";

		axios({
			method,
			url,
			data: newWorkshopData,
		})
			.then((response) => {
				setWorkshop(response.data);
				setShowModal(false);
				setIsEditing(false);
				setWorkshopToEdit(null);
				setNewWorkshopData({
					name: "",
					location: "",
					date_time: "",
					description: "",
					event_id: event.event_id,
				});
			})
			.catch((error) =>
				console.error("Error al guardar congresillo:", error),
			)
			.finally(() => setIsCreating(false));
	};

	const handleEdit = () => {
		setIsEditing(true);
		setShowModal(true);
		setWorkshopToEdit(workshop);
		setNewWorkshopData({
			name: workshop.name,
			location: workshop.location,
			date_time: workshop.date_time,
			description: workshop.description,
			event_id: event.event_id,
		});
	};

	const formatDate = (dateString) => {
		if (dateString) {
			const date = new Date(dateString);
			const day = date.toLocaleDateString("es-ES", { day: "2-digit" });
			const month = date.toLocaleDateString("es-ES", {
				month: "2-digit",
			});
			const year = date.toLocaleDateString("es-ES", { year: "numeric" });
			return `${day}/${month}/${year}`;
		}
		return "";
	};

	const formatTime = (dateString) => {
		if (dateString) {
			const date = new Date(dateString);
			const hours = date.toLocaleTimeString("es-ES", { hour: "2-digit" });
			const minutes = date.toLocaleTimeString("es-ES", {
				minute: "2-digit",
			});
			return `${hours}:${minutes}`;
		}
		return "";
	};

	const isWorkshopDateInFuture = () => {
		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		if (workshop && workshop.date_time) {
			const workshopDate = new Date(workshop.date_time);
			const currentDate = new Date();
			return workshopDate > currentDate;
		}
		return false;
	};

	const startDate = new Date(event.start_date); // Convierte la fecha de inicio del evento a objeto Date

	const minDate = new Date(startDate);
	minDate.setDate(startDate.getDate() + 2); // Suma 2 días a la fecha de inicio para obtener la fecha mínima

	const maxDate = new Date(startDate);
	maxDate.setDate(startDate.getDate() + 4);

	const formatDateForInput = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const formatDateTimeForInput = (date) => {
		const formattedDate = formatDateForInput(date);
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		return `${formattedDate}T${hours}:${minutes}`;
	};

	return (
		<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
			<h2 className='text-xl font-bold mb-4'>CONGRESILLO TÉCNICO</h2>
			{workshop ? (
				<>
					<p>
						<strong>Nombre: </strong>
						{workshop.name}
					</p>
					<p>
						<strong>Lugar: </strong>
						{workshop.location}
					</p>

					<p>
						<strong>Fecha y Hora: </strong>
						{formatDate(workshop.date_time)} -{" "}
						{formatTime(workshop.date_time)}
					</p>
					<p>
						<strong>Descripción: </strong>
						{workshop.description}
					</p>
					{workshop &&
						isWorkshopDateInFuture() && ( // Condición para mostrar el botón de editar
							// biome-ignore lint/a11y/useButtonType: <explanation>
							<button
								className='bg-neutral-200 text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 rounded-md p-1'
								onClick={handleEdit}
							>
								<EditIcon />
							</button>
						)}
				</>
			) : (
				<button
					type='button'
					onClick={handleCreateWorkshop}
					disabled={isCreating}
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				>
					{isCreating ? "Creando..." : "Crear Congresillo"}
				</button>
			)}

			{/* Modal para crear congresillo */}
			{showModal && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center'>
					<div className='bg-white p-6 rounded-lg'>
						<h3 className='text-lg font-bold mb-4'>
							{isEditing
								? "Editar Congresillo Técnico"
								: "Crear Congresillo Técnico"}
						</h3>
						<form onSubmit={handleSubmit}>
							<div className='mb-4'>
								<label
									htmlFor='name'
									className='block font-medium'
								>
									Nombre:
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={newWorkshopData.name}
									onChange={handleInputChange}
									className='border border-gray-300 px-3 py-2 rounded w-full'
									required
								/>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='location'
									className='block font-medium'
								>
									Lugar:
								</label>
								<input
									type='text'
									id='location'
									name='location'
									value={newWorkshopData.location}
									onChange={handleInputChange}
									className='border border-gray-300 px-3 py-2 rounded w-full'
									required
								/>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='date_time'
									className='block font-medium'
								>
									Fecha y hora:
								</label>
								<input
									type='datetime-local'
									id='date_time'
									name='date_time'
									value={newWorkshopData.date_time}
									onChange={handleInputChange}
									className='border border-gray-300 px-3 py-2 rounded w-full'
									required
									min={formatDateTimeForInput(minDate)} // Establece la fecha mínima
									max={formatDateTimeForInput(maxDate)} // Establece la fecha máxima
								/>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='description'
									className='block font-medium'
								>
									Descripción:
								</label>
								<textarea
									id='description'
									name='description'
									value={newWorkshopData.description}
									onChange={handleInputChange}
									className='border border-gray-300 px-3 py-2 rounded w-full'
									required
								/>
							</div>
							<div className='flex justify-end'>
								<button
									type='button'
									onClick={handleCloseModal}
									className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2'
								>
									Cancelar
								</button>
								<button
									type='submit'
									disabled={isCreating}
									className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								>
									{isCreating ? "Guardando..." : "Guardar"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default WorkShop;
