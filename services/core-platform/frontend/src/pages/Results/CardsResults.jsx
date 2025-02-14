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
	const [showMatches, setShowMatches] = useState(true); // Nuevo estado para mostrar/ocultar partidos

	// 🔄 Obtener la lista de instituciones y escenarios (combinado en un solo useEffect)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [institutionsResponse, venuesResponse] = await axios.all([
					axios.get(`${API_BASE_URL}/institutions/`),
					axios.get(`${API_BASE_URL}/sports_venues/`),
				]);

				const institutionsMapping = {};
				institutionsResponse.data.forEach((institution) => {
					institutionsMapping[institution.institution_id] =
						institution.name;
				});
				setInstitutions(institutionsMapping);

				const venuesMapping = {};
				venuesResponse.data.forEach((venue) => {
					venuesMapping[venue.venue_id] = venue.name;
				});
				setVenues(venuesMapping);

				console.log(
					"✅ Datos cargados:",
					institutionsMapping,
					venuesMapping,
				);
			} catch (error) {
				console.error("❌ Error al cargar datos:", error);
			}
		};

		fetchData();
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

	const handleMatchClick = (match) => {
		setSelectedMatch(match);
		setShowMatches(false); // Ocultar los partidos
	};

	// Función para volver a la lista de partidos
	const handleBackToMatches = () => {
		setSelectedMatch(null);
		setShowMatches(true); // Mostrar los partidos nuevamente
	};

	return (
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-4 text-center'>
				Encuentros Disponibles
			</h2>

			{loading ? (
				<p className='text-center text-gray-500'>
					Cargando encuentros...
				</p>
			) : (
				showMatches && ( // Mostrar partidos solo si showMatches es true
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{matches.map((match) => (
							<div
								key={match.team_schedule_id}
								className='bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all'
								onClick={() => handleMatchClick(match)} // Usar la nueva función
							>
								<div className='border rounded-lg p-4'>
									{" "}
									{/* Tarjeta */}
									<h3 className='text-lg font-semibold text-blue-700'>
										⚔️{" "}
										{institutions[match.institution_id1] ||
											"Desconocido"}{" "}
										vs{" "}
										{institutions[match.institution_id2] ||
											"Desconocido"}
									</h3>
									<p className='text-gray-600 mt-1'>
										{match.encounter_date.split("T")[0]}
									</p>
									<p className='text-gray-600'>
										‍⚖️ Juez: {match.judge_id}
									</p>
									<p className='text-gray-600'>
										Escenario:{" "}
										{venues[match.venue_id] ||
											"Escenario desconocido"}
									</p>
									<p className='text-gray-600'>
										🆔 Evento: {match.event_id}
									</p>
								</div>{" "}
								{/* Fin de la tarjeta */}
							</div>
						))}
					</div>
				)
			)}

			{/* Mostrar el componente FootballResultsForm */}
			{selectedMatch && (
				<div className='mt-8'>
					<FootballResultsForm match={selectedMatch} />
					{/* Botón para regresar a los partidos */}
					<button
						className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
						onClick={handleBackToMatches}
					>
						Regresar a los partidos
					</button>
				</div>
			)}
		</div>
	);
};

export default MatchList;
