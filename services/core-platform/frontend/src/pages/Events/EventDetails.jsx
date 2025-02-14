import React, { useState, useEffect } from "react";
import CalendarFutbolBasket from "../../components/Events/CalendarFutbolBasket";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import EditIcon from "../../components/Icons/EditIcon";
import WorkShop from "../../components/Events/WorkShops";
import InstitutionsAndVenues from "../../components/Events/InstitutionsAndVenues";
import FormEvent from "../../components/Events/FormEvent";

const EventDetails = ({ event }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleEdit = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	// Función para verificar si la fecha de inicio del evento es mayor a la fecha actual
	const isEventStartDateInFuture = () => {
		const currentDate = new Date(); // Fecha actual
		const eventStartDate = new Date(event.start_date); // Fecha de inicio del evento
		return eventStartDate > currentDate; // Devuelve true si la fecha de inicio es futura
	};

	// Función para manejar el borrado del evento
	const handleDelete = () => {
		// Lógica para borrar el evento (puedes implementar una llamada a la API aquí)
		console.log("Evento borrado");
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md'>
			{/* Sección: Detalles del Evento */}
			<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
				<h2 className='text-xl font-bold mb-4'>DETALLES DEL EVENTO</h2>
				<p>
					<strong>Nombre:</strong> {event.name}
				</p>
				<p>
					<strong>Fecha de Inicio:</strong> {event.start_date}
				</p>
				<p>
					<strong>Fecha de Fin:</strong> {event.end_date}
				</p>
				<p>
					<strong>Registro Inicio:</strong>{" "}
					{event.registration_start_date}
				</p>
				<p>
					<strong>Registro Fin:</strong> {event.registration_end_date}
				</p>
				<p>
					<strong>Deporte:</strong> {event.sport.name}
				</p>
				<p>
					<strong>Categoría:</strong> {event.category.name}
				</p>

				{/* Botones de Borrar y Editar (solo si la fecha de inicio es futura) */}
				{isEventStartDateInFuture() && (
					<div className='flex gap-2 mt-4'>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							className='bg-neutral-200 text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 rounded-md p-1'
							onClick={handleEdit}
						>
							<EditIcon />
						</button>
					</div>
				)}

				{/* Modal */}
				{isModalOpen && (
					<div
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							zIndex: 1000,
						}}
					>
						<div
							style={{
								backgroundColor: "#fff",
								padding: "20px",
								borderRadius: "8px",
								boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
							}}
						>
							<FormEvent
								onEventCreated={() => {
									closeModal();
									// Recargar los detalles del evento o actualizar el estado con los nuevos datos
								}}
								eventToEdit={event}
							/>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button onClick={closeModal}>Cerrar</button>{" "}
							{/* Botón para cerrar el modal */}
						</div>
					</div>
				)}
			</div>
			{/* Sección: Congresillo Técnico */}
			<WorkShop event={event} />
			{/* Sección: Instituciones y Escenarios Participantes */}
			<InstitutionsAndVenues event={event} />
			{/* Sección: Calendario de Encuentros */}
			<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
				<h2 className='text-xl font-bold mb-4'>
					CALENDARIO DE ENCUENTROS
				</h2>
				<CalendarFutbolBasket event={event} />
			</div>
		</div>
	);
};

export default EventDetails;
