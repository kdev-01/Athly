import { useState, useEffect } from "react";
import axios from "axios";
import FootballResultsForm from "./FootballResultsForm"; // Componente de resultados

const API_BASE_URL = "http://127.0.0.1:8000/api";

const MatchList = () => {
	const [matches, setMatches] = useState([]);
	const [institutions, setInstitutions] = useState({});
	const [venues, setVenues] = useState({});
	const [selectedMatch, setSelectedMatch] = useState(null);
	const [loading, setLoading] = useState(true);

	// 🔄 Obtener la lista de instituciones
	useEffect(() => {
		const fetchInstitutions = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/institutions/`,
				);
				const mapping = {};
				// biome-ignore lint/complexity/noForEach: <explanation>
				response.data.forEach((institution) => {
					mapping[institution.institution_id] = institution.name;
				});
				setInstitutions(mapping);
				console.log("✅ Instituciones cargadas:", mapping);
			} catch (error) {
				console.error("❌ Error al cargar instituciones:", error);
			}
		};

		const fetchVenues = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/sports_venues/`,
				);
				const mapping = {};
				// biome-ignore lint/complexity/noForEach: <explanation>
				response.data.forEach((venue) => {
					mapping[venue.venue_id] = venue.name;
				});
				setVenues(mapping);
				console.log("✅ Escenarios cargados:", mapping);
			} catch (error) {
				console.error("❌ Error al cargar escenarios:", error);
			}
		};

		fetchInstitutions();
		fetchVenues();
	}, []);

	// 🔄 Obtener la lista de encuentros
	useEffect(() => {
		const fetchMatches = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/team_schedule/team_schedules/`,
				);
				setMatches(response.data);
			} catch (error) {
				console.error("❌ Error al cargar los encuentros:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMatches();
	}, []);

	return (
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-4 text-center'>
				📅 Encuentros Disponibles
			</h2>

			{loading ? (
				<p className='text-center text-gray-500'>
					Cargando encuentros...
				</p>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{matches.map((match) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							key={match.team_schedule_id}
							className='bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all'
							onClick={() => setSelectedMatch(match)}
						>
							<h3 className='text-lg font-semibold text-blue-700'>
								⚔️{" "}
								{institutions[match.institution_id1] ||
									"Desconocido"}{" "}
								vs{" "}
								{institutions[match.institution_id2] ||
									"Desconocido"}
							</h3>
							<p className='text-gray-600 mt-1'>
								📅 {match.encounter_date.split("T")[0]}
							</p>
							<p className='text-gray-600'>
								🧑‍⚖️ Juez: {match.judge_id}
							</p>
							<p className='text-gray-600'>
								📍 Escenario:{" "}
								{venues[match.venue_id] ||
									"Escenario desconocido"}
							</p>
							<p className='text-gray-600'>
								🧑ID_envento: {match.event_id}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Mostrar el formulario cuando se selecciona un encuentro */}
			{selectedMatch && (
				<div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl'>
						<h2 className='text-xl font-bold mb-4 text-center'>
							✍️ Ingresar Resultados
						</h2>
						{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
						<button
							onClick={() => setSelectedMatch(null)}
							className='absolute top-4 right-4 text-gray-500 hover:text-red-600'
						>
							❌ Cerrar
						</button>
						<FootballResultsForm
							teamA={institutions[selectedMatch.institution_id1]}
							teamB={institutions[selectedMatch.institution_id2]}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default MatchList;
