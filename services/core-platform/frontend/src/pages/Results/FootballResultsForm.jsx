import React, { useState, useEffect } from "react";
import axios from "axios";

const FootballResultsForm = ({ match }) => {
	const [rep1Id, setRep1Id] = useState(null);
	const [rep2Id, setRep2Id] = useState(null);
	const [students1, setStudents1] = useState([]);
	const [students2, setStudents2] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [inst1Name, setInst1Name] = useState(null);
	const [inst2Name, setInst2Name] = useState(null);

	const handleInputChange = (event, studentId, institution) => {
		const { name, value } = event.target;
		const updateStudents = institution === 1 ? students1 : students2;
		const setStudents = institution === 1 ? setStudents1 : setStudents2;

		const updatedStudents = updateStudents.map((student) => {
			if (student.student_id === studentId) {
				return {
					...student,
					[name]: value,
				};
			}
			return student;
		});

		setStudents(updatedStudents);
	};

	useEffect(() => {
		const fetchRepAndStudents = async () => {
			try {
				// Obtener representantes de la institución 1
				const rep1Response = await axios.get(
					`http://127.0.0.1:8000/api/representatives/representatives/?institution_id=${match.institution_id1}`,
				);
				const rep1Data = rep1Response.data;

				if (rep1Data.length > 0) {
					const rep1Id = rep1Data[0].representative_id;
					setRep1Id(rep1Id);

					// Obtener estudiantes de la institución 1
					const students1Response = await axios.get(
						`http://localhost:8000/api/students/students/?representative_id=${rep1Id}`,
					);
					const students1Data = students1Response.data;

					// Inicializar datos de estudiantes con valores vacíos
					const students1WithData = students1Data.map((student) => ({
						...student,
						goals: "",
						assists: "",
						yellow_cards: "",
						red_cards: "",
					}));
					setStudents1(students1WithData);
				}

				// Obtener representantes de la institución 2
				const rep2Response = await axios.get(
					`http://127.0.0.1:8000/api/representatives/representatives/?institution_id=${match.institution_id2}`,
				);
				const rep2Data = rep2Response.data;

				if (rep2Data.length > 0) {
					const rep2Id = rep2Data[0].representative_id;
					setRep2Id(rep2Id);

					// Obtener estudiantes de la institución 2
					const students2Response = await axios.get(
						`http://localhost:8000/api/students/students/?representative_id=${rep2Id}`,
					);
					const students2Data = students2Response.data;

					// Inicializar datos de estudiantes con valores vacíos
					const students2WithData = students2Data.map((student) => ({
						...student,
						goals: "",
						assists: "",
						yellow_cards: "",
						red_cards: "",
					}));
					setStudents2(students2WithData);
				}

				const inst1Response = await axios.get(
					`http://localhost:8000/api/institutions/${match.institution_id1}`, // Reemplaza con la URL correcta
				);
				const inst1Data = inst1Response.data;
				if (inst1Data) {
					setInst1Name(inst1Data.name);
				}

				const inst2Response = await axios.get(
					`http://localhost:8000/api/institutions/${match.institution_id2}`, // Reemplaza con la URL correcta
				);
				const inst2Data = inst2Response.data;
				if (inst2Data) {
					setInst2Name(inst2Data.name);
				}
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchRepAndStudents();
	}, [match.institution_id1, match.institution_id2]);

	if (loading) {
		return <p>Cargando datos...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<div>
			<p>{inst1Name}</p>
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					margin: "20px 0",
					boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
				}}
			>
				<thead>
					<tr
						style={{
							backgroundColor: "#4CAF50",
							color: "white",
							fontWeight: "bold",
						}}
					>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Nombres
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Goles
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Asistencias
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Tarjetas Amarillas
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Tarjetas Rojas
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Acciones
						</th>
					</tr>
				</thead>
				<tbody>
					{students1.map((student) => (
						<tr
							key={student.student_id}
							style={{
								borderBottom: "1px solid #ddd",
								backgroundColor: "#fff",
							}}
						>
							<td style={{ padding: "12px", border: "none" }}>
								{student.names} {student.surnames}
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='goals'
									value={student.goals}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											1,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='assists'
									value={student.assists}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											1,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='yellow_cards'
									value={student.yellow_cards}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											1,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='red_cards'
									value={student.red_cards}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											1,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
								<button
									style={{
										padding: "8px 12px",
										backgroundColor: "#4CAF50",
										color: "white",
										border: "none",
										borderRadius: "4px",
										cursor: "pointer",
										marginRight: "5px",
									}}
								>
									Editar
								</button>
								{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
								<button
									style={{
										padding: "8px 12px",
										backgroundColor: "#f44336",
										color: "white",
										border: "none",
										borderRadius: "4px",
										cursor: "pointer",
									}}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Tabla para estudiantes de la institución 2 */}
			<p>{inst2Name}</p>
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					margin: "20px 0",
					boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
				}}
			>
				<thead>
					<tr
						style={{
							backgroundColor: "#4CAF50",
							color: "white",
							fontWeight: "bold",
						}}
					>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Nombres
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Goles
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Asistencias
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Tarjetas Amarillas
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Tarjetas Rojas
						</th>
						<th
							style={{
								padding: "12px",
								border: "none",
								textAlign: "left",
							}}
						>
							Acciones
						</th>
					</tr>
				</thead>
				<tbody>
					{students2.map((student) => (
						<tr
							key={student.student_id}
							style={{
								borderBottom: "1px solid #ddd",
								backgroundColor: "#fff",
							}}
						>
							<td style={{ padding: "12px", border: "none" }}>
								{student.names} {student.surnames}
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='goals'
									value={student.goals}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											2,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='assists'
									value={student.assists}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											2,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='yellow_cards'
									value={student.yellow_cards}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											2,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<input
									type='number'
									name='red_cards'
									value={student.red_cards}
									onChange={(e) =>
										handleInputChange(
											e,
											student.student_id,
											2,
										)
									}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
									}}
								/>
							</td>
							<td style={{ padding: "12px", border: "none" }}>
								<button
									style={{
										padding: "8px 12px",
										backgroundColor: "#4CAF50",
										color: "white",
										border: "none",
										borderRadius: "4px",
										cursor: "pointer",
										marginRight: "5px",
									}}
								>
									Editar
								</button>
								<button
									style={{
										padding: "8px 12px",
										backgroundColor: "#f44336",
										color: "white",
										border: "none",
										borderRadius: "4px",
										cursor: "pointer",
									}}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default FootballResultsForm;
