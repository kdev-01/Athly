import React, { useState, useEffect } from "react";
import axios from "axios";

const judges = [
	{ id: 4, name: "Carlos Fernández" },
	{ id: 5, name: "María Gómez" },
	{ id: 6, name: "Jorge Martínez" },
	{ id: 7, name: "Luisa Pérez" },
	{ id: 8, name: "Fernando Chávez" },
];
const CalendarFutbolBasket = ({ event }) => {
	const [institutions, setInstitutions] = useState([]);
	const [venues, setVenues] = useState([]);
	const [schedule, setSchedule] = useState([]);
	const [isGenerated, setIsGenerated] = useState(false);

	useEffect(() => {
		axios
			.all([
				axios.get("http://localhost:8000/api/institutions"),
				axios.get("http://localhost:8000/api/sports_venues"),
				axios.get("http://localhost:8000/api/event_participants"),
				axios.get("http://localhost:8000/api/venue_event"),
			])
			.then(
				axios.spread(
					(
						institutionsResponse,
						venuesResponse,
						participantsResponse,
						venueEventResponse,
					) => {
						const participantInstitutions =
							participantsResponse.data
								.filter(
									(participant) =>
										participant.id_event === event.event_id,
								)
								.map(
									(participant) =>
										participant.id_educational_institution,
								);

						const relatedInstitutions =
							institutionsResponse.data.filter((institution) =>
								participantInstitutions.includes(
									institution.institution_id,
								),
							);
						setInstitutions(relatedInstitutions);

						const relatedVenues = venueEventResponse.data
							.filter(
								(venueEvent) =>
									venueEvent.id_event === event.event_id,
							)
							.map((venueEvent) => venueEvent.id_venue);

						const venuesList = venuesResponse.data.filter((venue) =>
							relatedVenues.includes(venue.venue_id),
						);
						setVenues(venuesList);
					},
				),
			)
			.catch((error) => {
				console.error("Error al cargar datos:", error);
			});
	}, [event.event_id]);

	const generateSchedule = () => {
		const schedule = [];
		const totalTeams = institutions.length;
		const totalRounds = totalTeams - 1;
		const matchesPerRound = totalTeams / 2;

		const startTime = new Date(event.start_date);
		startTime.setHours(7, 30, 0);
		const endTime = new Date(event.start_date);
		endTime.setHours(11, 30, 0);

		for (let round = 0; round < totalRounds; round++) {
			const roundMatches = [];
			for (let i = 0; i < matchesPerRound; i++) {
				const team1 = institutions[i];
				const team2 = institutions[totalTeams - 1 - i];
				const venue = venues[i % venues.length];
				const matchTime = new Date(startTime);
				matchTime.setHours(startTime.getHours() + i);

				if (matchTime <= endTime) {
					const timestamp = matchTime.toISOString();
					const judge = judges[i % judges.length];

					const matchData = {
						institution_id1: team1.institution_id,
						institution_id2: team2.institution_id,
						venue_id: venue.venue_id,
						judge_id: judge.id,
						event_id: event.event_id,
						encounter_date: timestamp,
					};

					roundMatches.push(matchData);

					axios
						.post(
							"http://localhost:8000/api/team_schedule/team_schedules/",
							matchData,
						)
						.then((response) => {
							console.log("Partido guardado:", response.data);
						})
						.catch((error) => {
							console.error("Error al guardar partido:", error);
						});
				}
			}
			institutions.splice(1, 0, institutions.pop());
			schedule.push(...roundMatches);
		}
		setSchedule(schedule);
		setIsGenerated(true);
	};

	return (
		<div>
			<h3>Calendario de Encuentros:</h3>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button onClick={generateSchedule} disabled={isGenerated}>
				Generar Calendario
			</button>
			<ul>
				{schedule.map((match, index) => (
					<li key={index}>
						{
							institutions.find(
								(inst) =>
									inst.institution_id ===
									match.institution_id1,
							)?.name
						}{" "}
						vs{" "}
						{
							institutions.find(
								(inst) =>
									inst.institution_id ===
									match.institution_id2,
							)?.name
						}{" "}
						en{" "}
						{
							venues.find(
								(venue) => venue.venue_id === match.venue_id,
							)?.name
						}{" "}
						el {match.encounter_date} <br />
						<strong>Juez:</strong>{" "}
						{
							judges.find((judge) => judge.id === match.judge_id)
								?.name
						}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CalendarFutbolBasket;
