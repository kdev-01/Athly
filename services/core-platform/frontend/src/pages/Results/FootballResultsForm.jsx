import { useState } from "react";

const FootballResultsForm = ({ teamA, teamB }) => {
	const [resultsA, setResultsA] = useState(
		teamA.map((player) => ({
			student_id: player.id,
			name: player.name,
			goals: 0,
			assists: 0,
			yellow_cards: 0,
			red_cards: 0,
			status: "Activo",
		})),
	);

	const [resultsB, setResultsB] = useState(
		teamB.map((player) => ({
			student_id: player.id,
			name: player.name,
			goals: 0,
			assists: 0,
			yellow_cards: 0,
			red_cards: 0,
			status: "Activo",
		})),
	);

	const handleChange = (team, index, field, value) => {
		if (team === "A") {
			const updatedResults = [...resultsA];
			updatedResults[index][field] = value;
			setResultsA(updatedResults);
		} else {
			const updatedResults = [...resultsB];
			updatedResults[index][field] = value;
			setResultsB(updatedResults);
		}
	};

	return (
		<div className='p-6 bg-white rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold mb-4 text-center'>
				📋 Planilla de Resultados
			</h2>

			<div className='gap-6'>
				{/* Equipo A */}
				<div>
					<h3 className='text-xl font-semibold mb-2 text-blue-700 text-center'>
						🏆 Equipo A
					</h3>
					<table className='w-full border-collapse border border-gray-300'>
						<thead>
							<tr className='bg-blue-200 text-center'>
								<th className='border p-2'>Jugador</th>
								<th className='border p-2'>⚽ Goles</th>
								<th className='border p-2'>🎯 Asistencias</th>
								<th className='border p-2'>🟨 Amarillas</th>
								<th className='border p-2'>🟥 Rojas</th>
								<th className='border p-2'>📌 Estado</th>
							</tr>
						</thead>
						<tbody>
							{resultsA.map((player, index) => (
								<tr
									key={player.student_id}
									className='text-center bg-white border'
								>
									<td className='border p-2 font-semibold'>
										{player.name}
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.goals}
											onChange={(e) =>
												handleChange(
													"A",
													index,
													"goals",
													parseInt(e.target.value),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
										/>
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.assists}
											onChange={(e) =>
												handleChange(
													"A",
													index,
													"assists",
													Number.parseInt(
														e.target.value,
													),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
										/>
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.yellow_cards}
											onChange={(e) =>
												handleChange(
													"A",
													index,
													"yellow_cards",
													// biome-ignore lint/style/useNumberNamespace: <explanation>
													parseInt(e.target.value),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
											max='2'
										/>
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.red_cards}
											onChange={(e) =>
												handleChange(
													"A",
													index,
													"red_cards",
													Number.parseInt(
														e.target.value,
													),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
											max='1'
										/>
									</td>
									<td className='border p-2'>
										<select
											value={player.status}
											onChange={(e) =>
												handleChange(
													"A",
													index,
													"status",
													e.target.value,
												)
											}
											className='border rounded px-2 py-1'
										>
											<option value='Activo'>
												Activo
											</option>
											<option value='Lesionado'>
												Lesionado
											</option>
											<option value='Suspendido'>
												Suspendido
											</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Equipo B */}
				<div>
					<h3 className='text-xl font-semibold mb-2 text-red-700 text-center'>
						🏆 Equipo B
					</h3>
					<table className='w-full border-collapse border border-gray-300'>
						<thead>
							<tr className='bg-red-200 text-center'>
								<th className='border p-2'>Jugador</th>
								<th className='border p-2'>⚽ Goles</th>
								<th className='border p-2'>🎯 Asistencias</th>
								<th className='border p-2'>🟨 Amarillas</th>
								<th className='border p-2'>🟥 Rojas</th>
								<th className='border p-2'>📌 Estado</th>
							</tr>
						</thead>
						<tbody>
							{resultsB.map((player, index) => (
								<tr
									key={player.student_id}
									className='text-center bg-white border'
								>
									<td className='border p-2 font-semibold'>
										{player.name}
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.goals}
											onChange={(e) =>
												handleChange(
													"B",
													index,
													"goals",
													parseInt(e.target.value),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
										/>
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.assists}
											onChange={(e) =>
												handleChange(
													"B",
													index,
													"assists",
													parseInt(e.target.value),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
										/>
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.yellow_cards}
											onChange={(e) =>
												handleChange(
													"B",
													index,
													"yellow_cards",
													parseInt(e.target.value),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
											max='2'
										/>
									</td>
									<td className='border p-2'>
										<input
											type='number'
											value={player.red_cards}
											onChange={(e) =>
												handleChange(
													"B",
													index,
													"red_cards",
													parseInt(e.target.value),
												)
											}
											className='w-16 text-center border rounded'
											min='0'
											max='1'
										/>
									</td>
									<td className='border p-2'>
										<select
											value={player.status}
											onChange={(e) =>
												handleChange(
													"B",
													index,
													"status",
													e.target.value,
												)
											}
											className='border rounded px-2 py-1'
										>
											<option value='Activo'>
												Activo
											</option>
											<option value='Lesionado'>
												Lesionado
											</option>
											<option value='Suspendido'>
												Suspendido
											</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default FootballResultsForm;
