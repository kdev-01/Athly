import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarFutbolBasket from "../../components/Events/CalendarFutbolBasket";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import EditIcon from "../../components/Icons/EditIcon";
import WorkShop from "../../components/Events/WorkShops";
import InstitutionsAndVenues from "../../components/Events/InstitutionsAndVenues";

const EventDetails = ({ event }) => {
	// Estados para almacenar datos relacionados con el evento
	const [institutions, setInstitutions] = useState([]); // Instituciones participantes
	const [allInstitutions, setAllInstitutions] = useState([]); // Todas las instituciones disponibles
	const [venues, setVenues] = useState([]); // Escenarios deportivos participantes
	const [allVenues, setAllVenues] = useState([]); // Todos los escenarios disponibles

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

	// Función para manejar la edición del evento
	const handleEdit = () => {
		// Lógica para editar el evento (puedes implementar una llamada a la API aquí)
		console.log("Evento editado");
	};

	const judges = [
		{ id: 4, name: "Carlos Fernández" },
		{ id: 5, name: "María Gómez" },
		{ id: 6, name: "Jorge Martínez" },
		{ id: 7, name: "Luisa Pérez" },
		{ id: 8, name: "Fernando Chávez" },
	];

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
							onClick={handleDelete}
						>
							<DeleteIcon />
						</button>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							className='bg-neutral-200 text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 rounded-md p-1'
							onClick={handleEdit}
						>
							<EditIcon />
						</button>
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
