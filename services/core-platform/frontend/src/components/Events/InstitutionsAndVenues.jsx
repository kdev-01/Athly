import React, { useState, useEffect } from "react";
import axios from "axios";

const InstitutionsAndVenues = ({ event }) => {
	const [institutions, setInstitutions] = useState([]);
	const [allInstitutions, setAllInstitutions] = useState([]);
	const [venues, setVenues] = useState([]);
	const [allVenues, setAllVenues] = useState([]);

	useEffect(() => {
		// Cargar instituciones educativas participantes en el evento
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

				// Cargar detalles de las instituciones participantes
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

		// Cargar escenarios deportivos participantes en el evento
		axios
			.get("http://localhost:8000/api/venue_event")
			.then((venuesResponse) => {
				const relatedVenues = venuesResponse.data
					.filter(
						(venueEvent) => venueEvent.id_event === event.event_id,
					)
					.map((venueEvent) => venueEvent.id_venue);

				// Cargar detalles de los escenarios participantes
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

		// Cargar todas las instituciones disponibles
		axios
			.get("http://localhost:8000/api/institutions")
			.then((response) => setAllInstitutions(response.data))
			.catch((error) =>
				console.error(
					"Error al cargar todas las instituciones:",
					error,
				),
			);

		// Cargar todos los escenarios deportivos disponibles
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

	const isRegistrationClosed = () => {
		const currentDate = new Date();
		const registrationEndDate = new Date(event.registration_end_date);
		return currentDate < registrationEndDate;
	};

	return (
		<div className='mt-6 bg-gray-100 p-6 rounded-lg shadow-inner'>
			{/* ... (resto del código sin cambios) */}
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

			{isRegistrationClosed() && (
				<div>
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
											(v) =>
												v.venue_id === venue.venue_id,
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
			)}
		</div>
	);
};

export default InstitutionsAndVenues;
