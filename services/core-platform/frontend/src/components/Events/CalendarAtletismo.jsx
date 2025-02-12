import { useState } from "react";

const CalendarAtletismo = ({ teams, scenarios, startDate, judges }) => {
	const [generated, setGenerated] = useState(false);
	const [races, setRaces] = useState([]);

	const generateCalendar = () => {
		// biome-ignore lint/style/useConst: <explanation>
		let newRaces = [];
		for (let i = 0; i < 3; i++) {
			newRaces.push({
				date: new Date(startDate).toDateString(),
				time: `${9 + i}:00 AM`,
				scenario: scenarios[i % scenarios.length].name,
				judge: judges[i % judges.length].name,
				competitors: teams,
			});
			9;
		}
		setRaces(newRaces);

		setGenerated(true);
	};

	return (
		<div className='p-4'>
			<h2 className='text-xl font-bold mb-4'>Calendario de Atletismo</h2>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={generateCalendar}
				className='mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800'
			>
				Generar Calendario
			</button>

			{generated && (
				<div>
					{races.map((race, index) => (
						<div
							key={index}
							className='calendar-section mb-6 bg-gray-200 p-4 rounded-lg shadow'
						>
							<h2 className='text-xl font-bold mb-4'>
								Carrera {index + 1} - {race.date}
							</h2>
							<p className='text-gray-600'>
								⏰ <strong>Hora:</strong> {race.time}
							</p>
							<p className='text-gray-600'>
								📍 <strong>Escenario:</strong> {race.scenario}
							</p>
							<p className='text-gray-600'>
								👨‍⚖️ <strong>Juez:</strong> {race.judge}
							</p>
							<div className='grid grid-cols-2 gap-4'>
								{race.competitors.map((team, i) => (
									<div
										key={i}
										className='bg-white p-4 rounded-lg shadow-md'
									>
										<p className='text-lg font-semibold'>
											🏃 {team}
										</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CalendarAtletismo;
