import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const CalendarFutbolBasket = ({
	teams,
	scenarios,
	startDate,
	judges,
	sport,
	eventId,
}) => {
	const [previewMatches, setPreviewMatches] = useState([]);
	const [calendarExists, setCalendarExists] = useState(false);
	const [saving, setSaving] = useState(false);
	const [institutionMap, setInstitutionMap] = useState({});

	// 🔄 Obtener el mapa de instituciones
	useEffect(() => {
		if (teams.length > 0) {
			const institutionMapping = {};
			teams.forEach((team) => {
				institutionMapping[team.id] = team.name;
			});
			setInstitutionMap(institutionMapping);
			console.log(
				"✅ Mapeo de Instituciones actualizado:",
				institutionMapping,
			);
		}
	}, [teams]);

	// 🔄 Verificar si el calendario ya existe en la BD para este evento
	useEffect(() => {
		const fetchSchedules = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/team_schedule/team_schedules/`,
				);
				const eventMatches = response.data.filter(
					(match) => match.event_id === eventId,
				);

				if (eventMatches.length > 0) {
					console.log(
						"✅ Calendario encontrado en la BD:",
						eventMatches,
					);
					setPreviewMatches(formatMatches(eventMatches));
					setCalendarExists(true);
				} else {
					console.log(
						"⚠️ No hay enfrentamientos en la BD para este evento.",
					);
				}
			} catch (error) {
				console.error("❌ Error al cargar los enfrentamientos:", error);
			}
		};

		// ⚡ Ejecutar solo cuando `institutionMap` tenga datos
		if (Object.keys(institutionMap).length > 0) {
			fetchSchedules();
		}
	}, [eventId, institutionMap]);

	// 🔄 Formatear datos de la BD para mostrar en el calendario
	const formatMatches = (data) => {
		let groupedRounds = {};

		data.forEach((match) => {
			const date = match.encounter_date.split("T")[0];

			if (!groupedRounds[date]) {
				groupedRounds[date] = [];
			}

			groupedRounds[date].push({
				team1: institutionMap[match.institution_id1] || "Desconocido",
				team2: institutionMap[match.institution_id2] || "Desconocido",
				scenario:
					scenarios.find((s) => s.venue_id === match.venue_id)
						?.name || "Escenario desconocido",
				judge:
					judges.find((j) => j.id === match.judge_id)?.name ||
					"Juez Desconocido",
				time: new Date(match.encounter_date).toLocaleTimeString(),
			});
		});

		return Object.keys(groupedRounds).map((date, index) => ({
			round: index + 1,
			matches: groupedRounds[date],
			date: date,
		}));
	};

	// 🔄 Generar previsualización del calendario
	const generatePreviewCalendar = () => {
		if (calendarExists) return;
		let newMatchesByRound = [];
		const totalRounds = teams.length - 1;
		let currentStartDate = new Date(startDate);

		for (let round = 0; round < totalRounds; round++) {
			let usedTeams = new Set();
			let roundMatches = [];

			for (let i = 0; i < teams.length / 2; i++) {
				const team1 = teams[i];
				const team2 = teams[teams.length - 1 - i];

				if (!usedTeams.has(team1.id) && !usedTeams.has(team2.id)) {
					roundMatches.push({ team1, team2 });
					usedTeams.add(team1.id);
					usedTeams.add(team2.id);
				}
			}

			teams.splice(1, 0, teams.pop());

			let matches = [];
			const matchTime = new Date(
				`${currentStartDate.toISOString().split("T")[0]}T07:30:00`,
			);

			for (let j = 0; j < roundMatches.length; j++) {
				const scenario = scenarios[j % scenarios.length];
				const judge = judges[j % judges.length];

				matches.push({
					institution_id1: roundMatches[j].team1.id,
					institution_id2: roundMatches[j].team2.id,
					venue_id: scenario.venue_id,
					scenario: scenario.name,
					judge_id: judge.id,
					judge: judge.name,
					encounter_date: matchTime.toISOString(),
				});

				matchTime.setHours(matchTime.getHours() + 1);
				if (matchTime.getHours() >= 12) break;
			}

			newMatchesByRound.push({
				round: round + 1,
				matches,
				date: currentStartDate.toISOString().split("T")[0],
			});

			currentStartDate.setDate(currentStartDate.getDate() + 1);
		}

		console.log("👀 Previsualización del calendario:", newMatchesByRound);
		setPreviewMatches(newMatchesByRound);
	};

	// 🔄 Guardar el calendario en la base de datos
	const saveCalendarToDB = async () => {
		setSaving(true);
		try {
			for (const round of previewMatches) {
				for (const match of round.matches) {
					await axios.post(
						`${API_BASE_URL}/team_schedule/team_schedules/`,
						{
							encounter_date: match.encounter_date,
							institution_id1: match.institution_id1,
							institution_id2: match.institution_id2,
							venue_id: match.venue_id,
							judge_id: match.judge_id,
							event_id: eventId,
						},
					);
				}
			}
			console.log("✅ Calendario guardado en la BD.");
			setCalendarExists(true);
		} catch (error) {
			console.error("❌ Error al guardar el calendario:", error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className='p-4'>
			<h2 className='text-2xl font-bold mb-4 text-center'>
				📅 Calendario de {sport}
			</h2>

			{/* Mostrar botones si NO existe el calendario */}
			{!calendarExists && (
				<div className='flex gap-4 justify-center'>
					<button
						onClick={generatePreviewCalendar}
						className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800 transition-all'
					>
						Generar Previsualización
					</button>
					{previewMatches.length > 0 && (
						<button
							onClick={saveCalendarToDB}
							disabled={saving}
							className={`px-6 py-2 rounded transition-all ${
								saving
									? "bg-gray-400 cursor-not-allowed"
									: "bg-green-600 text-white hover:bg-green-800"
							}`}
						>
							{saving ? "Guardando..." : "Guardar Calendario"}
						</button>
					)}
				</div>
			)}

			{/* Mostrar solo el calendario si ya está guardado */}
			{previewMatches.length > 0 && (
				<div className='mt-6 space-y-6'>
					{previewMatches.map((roundData, index) => (
						<div
							key={index}
							className='bg-gray-100 p-4 rounded-lg shadow-md'
						>
							<h2 className='text-lg font-bold mb-2 text-gray-700'>
								🏆 Ronda {roundData.round} - 📅 {roundData.date}
							</h2>
							{roundData.matches.map((match, i) => (
								<p
									key={i}
									className='text-blue-700 font-semibold'
								>
									<div className='bg-gray-400'>
										⚔️ {match.team1} 🆚 {match.team2} <br />
										📍{match.scenario} <br />
										🧑‍⚖️{match.judge}
									</div>
								</p>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CalendarFutbolBasket;
