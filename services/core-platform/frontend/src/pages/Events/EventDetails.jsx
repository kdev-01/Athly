import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "../../components/Events/Calendar";

const EventDetails = ({ event }) => {
	const [workshop, setWorkshop] = useState(null);
	const [institutions, setInstitutions] = useState([]);
	const [allInstitutions, setAllInstitutions] = useState([]);
	const [venues, setVenues] = useState([]);

	useEffect(() => {
		// Cargar workshops y buscar el relacionado al evento
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

		// Cargar instituciones educativas relacionadas al evento
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

		// Cargar todas las instituciones disponibles
		axios
			.get("http://localhost:8000/api/institutions")
			.then((response) => {
				setAllInstitutions(response.data);
			})
			.catch((error) =>
				console.error(
					"Error al cargar todas las instituciones:",
					error,
				),
			);

		// Cargar escenarios deportivos relacionados al evento
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
	}, [event.event_id]);

	// Función para agregar una institución al evento
	const addInstitutionToEvent = async () => {
		const selectElement = document.getElementById("institutionSelect");
		const selectedInstitutionId = selectElement.value;

		if (!selectedInstitutionId) {
			alert("Selecciona una institución para agregar.");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:8000/api/event_participants/",
				{
					id_event: event.event_id,
					id_educational_institution: selectedInstitutionId,
				},
			);

			if (response.status === 201 || response.status === 200) {
				const addedInstitution = allInstitutions.find(
					(inst) =>
						inst.institution_id === parseInt(selectedInstitutionId),
				);

				setInstitutions([...institutions, addedInstitution]);
				selectElement.value = "";
			} else {
				console.error("Error al agregar la institución:", response);
			}
		} catch (error) {
			console.error("Error al conectar con la API:", error);
			alert(
				error.response?.data?.detail ||
					"Error al agregar la institución.",
			);
		}
	};

	// Función para eliminar una institución del evento
	const removeInstitutionFromEvent = async (institutionId) => {
		const confirmDelete = window.confirm(
			"¿Estás seguro de que deseas eliminar esta institución?",
		);
		if (!confirmDelete) return;

		try {
			const response = await axios.delete(
				`http://localhost:8000/api/event_participants/${event.event_id}/${institutionId}`,
			);

			if (response.status === 200) {
				setInstitutions(
					institutions.filter(
						(inst) => inst.institution_id !== institutionId,
					),
				);
			} else {
				console.error("Error al eliminar la institución:", response);
			}
		} catch (error) {
			console.error("Error al conectar con la API:", error);
			alert(
				error.response?.data?.detail ||
					"Error al eliminar la institución.",
			);
		}
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md'>
			{/* Título principal */}
			<div className='bg-black text-white text-center font-bold py-3 rounded-t-lg'>
				DETALLES DEL EVENTO
			</div>

			{/* Instituciones Educativas Participantes */}
			<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
				<h2 className='text-xl font-bold mb-4'>
					INSTITUCIONES EDUCATIVAS PARTICIPANTES
				</h2>
				{institutions.length > 0 ? (
					<ul>
						{institutions.map((institution) => (
							<li
								key={institution.institution_id}
								className='mb-2 flex items-center gap-2'
							>
								<button
									className='px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-800'
									onClick={() =>
										removeInstitutionFromEvent(
											institution.institution_id,
										)
									}
								>
									Eliminar
								</button>
								<p>{institution.name}</p>
							</li>
						))}
					</ul>
				) : (
					<p className='text-gray-600'>
						No hay instituciones educativas participantes en este
						evento.
					</p>
				)}

				{/* Listbox desplegable para agregar una nueva institución */}
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
					<button
						className='px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700'
						onClick={addInstitutionToEvent}
					>
						Agregar
					</button>
				</div>
			</div>

			{/* Calendario de Encuentros */}
			<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
				<h2 className='text-xl font-bold mb-4'>
					CALENDARIO DE ENCUENTROS
				</h2>
				<Calendar
					teams={institutions.map((institution) => institution.name)}
					scenarios={venues}
					startDate={event.start_date}
				/>
			</div>
		</div>
	);
};

export default EventDetails;
