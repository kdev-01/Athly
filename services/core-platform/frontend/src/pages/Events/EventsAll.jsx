import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../../components/Events/EventCard";
import EventDetails from "./EventDetails";
import FormEvent from "../../components/Events/FormEvent";

const EventsAll = () => {
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null); // Estado para evento seleccionado
	const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = () => {
		axios
			.get("http://localhost:8000/api/events/")
			.then((response) => setEvents(response.data))
			.catch((error) =>
				console.error("Error al obtener los eventos:", error),
			);
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleEventClick = (event) => {
		setSelectedEvent(event);
	};

	const handleBackToList = () => {
		setSelectedEvent(null);
	};

	return (
		<div className='min-h-screen w-full bg-gray-100 p-6'>
			{/* Encabezado */}
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold text-gray-800'>
					Gestión de Eventos Deportivos
				</h1>
				{!selectedEvent && (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						onClick={handleOpenModal}
						className='bg-black text-white py-2 px-4 rounded hover:bg-gray-800'
					>
						Crear Evento
					</button>
				)}
			</div>

			{/* Detalles del Evento o Tarjetas */}
			{selectedEvent ? (
				<div>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={handleBackToList}
						className='mb-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-600'
					>
						Volver al Listado
					</button>
					<EventDetails event={selectedEvent} />
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{events.length > 0 ? (
						events.map((event) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={event.event_id}
								onClick={() => handleEventClick(event)} // Manejar clic en un evento
								className='cursor-pointer'
							>
								<EventCard
									eventName={event.name}
									startDate={event.start_date}
									endDate={event.end_date}
									sportName={
										event.sport
											? event.sport.name
											: "Desconocido"
									}
									categoryName={
										event.category
											? event.category.name
											: "Desconocida"
									}
								/>
							</div>
						))
					) : (
						<p className='text-gray-600'>
							No hay eventos disponibles.
						</p>
					)}
				</div>
			)}

			{/* Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
					<div
						className='bg-white rounded-lg p-8 w-full max-w-6xl'
						style={{ maxHeight: "90vh", overflowY: "auto" }}
					>
						<div className='flex justify-end'>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button
								onClick={handleCloseModal}
								className='text-gray-600 text-2xl hover:text-gray-800'
							>
								&times;
							</button>
						</div>
						<FormEvent
							onEventCreated={() => {
								fetchEvents();
								handleCloseModal();
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default EventsAll;
