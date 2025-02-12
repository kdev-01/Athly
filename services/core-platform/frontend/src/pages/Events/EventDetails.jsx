import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarFutbolBasket from "../../components/Events/CalendarFutbolBasket";

const EventDetails = ({ event }) => {
	const [workshop, setWorkshop] = useState(null);
	const [institutions, setInstitutions] = useState([]);
	const [allInstitutions, setAllInstitutions] = useState([]);
	const [venues, setVenues] = useState([]);
	const [allVenues, setAllVenues] = useState([]);

	useEffect(() => {
		// Cargar congresillo técnico
		axios
			.get("http://localhost:8000/api/workshops")
			.then((response) => {
				const relatedWorkshop = response.data.find(
					(ws) => ws.event_id === event.event_id,
				);
				setWorkshop(relatedWorkshop);
			})
			.catch((error) =>
				console.error(
					"Error al cargar los congresillos técnicos:",
					error,
				),
			);

		// Cargar instituciones educativas y escenarios deportivos del evento
		axios
			.get("http://localhost:8000/api/event_participants")
			.then((participantsResponse) => {
				const participantInstitutions = participantsResponse.data
					.filter(
						(participant) =>
							participant.id_event === event.event_id,
					)
					.map(
						(participant) => participant.id_educational_institution,
					);

				axios
					.get("http://localhost:8000/api/institutions")
					.then((institutionsResponse) => {
						const relatedInstitutions =
							institutionsResponse.data.filter((institution) =>
								participantInstitutions.includes(
									institution.institution_id,
								),
							);
						setInstitutions(relatedInstitutions);
					})
					.catch((error) =>
						console.error(
							"Error al cargar las instituciones:",
							error,
						),
					);
			})
			.catch((error) =>
				console.error(
					"Error al cargar los participantes del evento:",
					error,
				),
			);

		axios
			.get("http://localhost:8000/api/venue_event")
			.then((venuesResponse) => {
				const relatedVenues = venuesResponse.data
					.filter(
						(venueEvent) => venueEvent.id_event === event.event_id,
					)
					.map((venueEvent) => venueEvent.id_venue);

				axios
					.get("http://localhost:8000/api/sports_venues")
					.then((venuesData) => {
						const venuesList = venuesData.data.filter((venue) =>
							relatedVenues.includes(venue.venue_id),
						);
						setVenues(venuesList);
					})
					.catch((error) =>
						console.error(
							"Error al cargar los escenarios deportivos:",
							error,
						),
					);
			})
			.catch((error) =>
				console.error(
					"Error al cargar la relación de escenarios:",
					error,
				),
			);

		// Cargar todas las instituciones y escenarios disponibles
		axios
			.get("http://localhost:8000/api/institutions")
			.then((response) => setAllInstitutions(response.data))
			.catch((error) =>
				console.error(
					"Error al cargar todas las instituciones:",
					error,
				),
			);

		axios
			.get("http://localhost:8000/api/sports_venues")
			.then((response) => setAllVenues(response.data))
			.catch((error) =>
				console.error(
					"Error al cargar todos los escenarios deportivos:",
					error,
				),
			);
	}, [event.event_id]);

	// Agregar una institución o un escenario al evento
	const addItemToEvent = async (type) => {
		const selectElement = document.getElementById(
			type === "institution" ? "institutionSelect" : "venueSelect",
		);
		const selectedId = selectElement.value;

		if (!selectedId) {
			alert(
				`Selecciona un ${type === "institution" ? "institución" : "escenario"} para agregar.`,
			);
			return;
		}

		try {
			const url =
				type === "institution" ? "event_participants" : "venue_event";
			const body =
				type === "institution"
					? {
							id_event: event.event_id,
							id_educational_institution: selectedId,
						}
					: { id_event: event.event_id, id_venue: selectedId };

			const response = await axios.post(
				`http://localhost:8000/api/${url}/`,
				body,
			);

			if (response.status === 201 || response.status === 200) {
				if (type === "institution") {
					const addedInstitution = allInstitutions.find(
						(inst) =>
							inst.institution_id === Number.parseInt(selectedId),
					);
					setInstitutions([...institutions, addedInstitution]);
				} else {
					const addedVenue = allVenues.find(
						(venue) =>
							venue.venue_id === Number.parseInt(selectedId),
					);
					setVenues([...venues, addedVenue]);
				}
				selectElement.value = "";
			}
		} catch (error) {
			console.error(
				`Error al agregar el ${type === "institution" ? "institución" : "escenario"}:`,
				error,
			);
		}
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
			{/* Información del Evento */}
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
			</div>

			{/* Congresillo Técnico */}
			<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
				<h2 className='text-xl font-bold mb-4'>CONGRESILLO TÉCNICO</h2>
				{workshop ? (
					<p>{workshop.name}</p>
				) : (
					<p className='text-gray-600'>No hay información.</p>
				)}
			</div>

			{/* Instituciones Educativas y Escenarios Deportivos Participantes */}
			<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
				<h2 className='text-xl font-bold mb-4'>
					INSTITUCIONES Y ESCENARIOS PARTICIPANTES
				</h2>
				<ul>
					{institutions.map((institution) => (
						<li
							key={institution.institution_id}
							className='mb-2 flex items-center gap-2'
						>
							<p>🏫 {institution.name}</p>
						</li>
					))}
					{venues.map((venue) => (
						<li
							key={venue.venue_id}
							className='mb-2 flex items-center gap-2'
						>
							<p>
								🏟 {venue.name} - {venue.location}
							</p>
						</li>
					))}
				</ul>

				{/* Agregar Institución */}
				<div className='flex gap-2 mt-4'>
					<select
						id='institutionSelect'
						className='flex-1 p-2 border border-gray-300 rounded-lg'
					>
						<option value=''>
							Seleccionar institución para agregar
						</option>
						{allInstitutions
							.filter(
								(institution) =>
									!institutions.some(
										(inst) =>
											inst.institution_id ===
											institution.institution_id,
									),
							)
							.map((institution) => (
								<option
									key={institution.institution_id}
									value={institution.institution_id}
								>
									{institution.name}
								</option>
							))}
					</select>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						className='px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700'
						onClick={() => addItemToEvent("institution")}
					>
						Agregar Institución
					</button>
				</div>

				{/* Agregar Escenario */}
				<div className='flex gap-2 mt-4'>
					<select
						id='venueSelect'
						className='flex-1 p-2 border border-gray-300 rounded-lg'
					>
						<option value=''>
							Seleccionar escenario para agregar
						</option>
						{allVenues
							.filter(
								(venue) =>
									!venues.some(
										(v) => v.venue_id === venue.venue_id,
									),
							)
							.map((venue) => (
								<option
									key={venue.venue_id}
									value={venue.venue_id}
								>
									{venue.name} - {venue.location}
								</option>
							))}
					</select>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						className='px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700'
						onClick={() => addItemToEvent("venue")}
					>
						Agregar Escenario
					</button>
				</div>
			</div>

			{/* Calendario de Encuentros */}
			<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
				<h2 className='text-xl font-bold mb-4'>
					CALENDARIO DE ENCUENTROS
				</h2>
				<CalendarFutbolBasket
					teams={institutions.map((institution) => ({
						id: institution.institution_id, // ID de la institución
						name: institution.name, // Nombre de la institución
					}))}
					scenarios={venues}
					startDate={event.start_date}
					judges={judges}
					sports={event.sport}
					eventId={event.event_id}
				/>
			</div>
		</div>
	);
};

export default EventDetails;
