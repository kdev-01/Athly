import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { toast } from "sonner";
import { calculateAge, formattedDate } from "../utils/operationsDates";
import { getColorTitle, getColorStatus } from "../utils/getStyles";
import StudentInformation from "./StudentInformation";
import EditStudent from "./EditStudent";
import RejectionDescription from "./RejectionDescription";
import Button from "./Button";
import Modal from "../components/Modal";
import BloodTypeIcon from "../components/Icons/BloodTypeIcon";
import TimeIcon from "../components/Icons/TimeIcon";
import BoyIcon from "../components/Icons/BoyIcon";
import WomanIcon from "../components/Icons/WomanIcon";

export default function ListStudents({ data }) {
	const [modal, setModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [action, setAction] = useState(null);
	const titleColor = getColorTitle(data.sport.name);

	const openModal = (student) => {
		const studentInfo = {
			...student,
			event_id: data.event_id,
		};

		setSelectedStudent(studentInfo);
		setModal(true);
	};

	const closeModal = () => {
		setModal(false);
		setSelectedStudent(null);
	};

	const { postRequest } = useFetch();
	const onSubmit = (dataRegister) => {
		toast("¿Está seguro/a de aprobar al estudiante?", {
			action: {
				label: "Confirmar",
				onClick: () => {
					const response = postRequest(
						dataRegister,
						"/student/status",
					);
					toast.promise(response, {
						loading: "Cargando...",
						success: (data) => {
							if (data.success) {
								return data.message;
							}

							throw new Error(data.message);
						},
						error: (err) => {
							return err.message;
						},
					});
				},
			},
		});
	};

	return (
		<>
			<section>
				{selectedStudent ? (
					<>
						<Modal
							isOpen={modal}
							onClose={closeModal}
							title='Estudiante'
							className='w-2/3 h-auto'
						>
							{action === "see" ? (
								<StudentInformation id={selectedStudent.id} />
							) : action === "rejection" ? (
								<RejectionDescription
									student={selectedStudent}
								/>
							) : (
								<EditStudent student={selectedStudent} />
							)}
						</Modal>
					</>
				) : (
					<>
						<header className='flex flex-col mt-5 p-5 bg-neutral-100 rounded-xl'>
							<h1 className='text-2xl font-bold'>
								Estudiantes inscritos
							</h1>

							<section className='flex gap-12 mt-2'>
								<div className='text-xs'>
									<h2
										className={`text-sm font-medium ${titleColor}`}
									>
										{data.name}
									</h2>
									{`${data.sport.name} - ${data.category.name}`}
								</div>

								<div className='text-xs'>
									<h2
										className={`font-medium text-sm ${titleColor}`}
									>
										Inscripciones
									</h2>
									{formattedDate(
										"custom",
										data.registration_start_date,
									)}
									{" - "}
									{formattedDate(
										"custom",
										data.registration_end_date,
									)}
								</div>

								<div className='text-xs'>
									<h2
										className={`font-medium text-sm ${titleColor}`}
									>
										Duración del evento
									</h2>
									{formattedDate("custom", data.start_date)}
									{" - "}
									{formattedDate("custom", data.end_date)}
								</div>
							</section>
						</header>

						<section>
							{data.institutions.length > 0 ? (
								data.institutions.map((institution) => (
									<article
										key={institution.id}
										className='p-2 mt-6'
									>
										<h2 className='text-[18px] font-semibold border-b-2 mb-7'>
											{institution.name}
										</h2>

										<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
											{institution.students.map(
												(student) => (
													<div
														key={student.id}
														className='bg-gray-50 relative p-5 rounded-md shadow-lg hover:shadow-md transition-shadow'
													>
														<span
															className={`absolute right-6 p-2 rounded-xl text-xs font-extrabold ${getColorStatus(
																student.status,
															)}`}
														>
															{student.status}
														</span>

														<section className='flex'>
															<img
																src={
																	student.photo
																}
																alt={`Foto de ${student.name}`}
																className='w-20 h-20 object-contain rounded-xl'
															/>

															<article className='flex flex-col ml-3'>
																<p className='font-bold'>
																	{
																		student.name
																	}{" "}
																	{
																		student.surname
																	}
																</p>

																<span className='text-xs mb-3'>
																	{
																		student.identification
																	}
																</span>

																<div className='flex gap-1'>
																	<p className='flex items-center p-[2px] pr-[8px] text-xs bg-neutral-100 rounded-lg mr-1'>
																		<TimeIcon className='p-1' />
																		{calculateAge(
																			student.date_birth,
																		)}{" "}
																		años
																	</p>

																	<p className='flex items-center p-[2px] pr-[8px] text-xs bg-neutral-100 rounded-lg mr-1'>
																		<BloodTypeIcon className='p-1' />
																		{
																			student.blood_type
																		}
																	</p>

																	<p className='flex items-center p-[2px] pr-[8px] text-xs bg-neutral-100 rounded-lg mr-1'>
																		{student.gender ===
																		1 ? (
																			<>
																				<BoyIcon />{" "}
																				Masculino
																			</>
																		) : (
																			<>
																				<WomanIcon className='p-[2px]' />{" "}
																				Femenino
																			</>
																		)}
																	</p>
																</div>
															</article>
														</section>

														<section className='flex justify-start gap-2 bg-neutral-100 text-sm mt-4 p-3 rounded-xl'>
															<Button
																onClick={() => {
																	setAction(
																		"see",
																	);
																	openModal(
																		student,
																	);
																}}
															>
																Ver documentos
															</Button>
															<Button
																onClick={() => {
																	setAction(
																		"edit",
																	);
																	openModal(
																		student,
																	);
																}}
															>
																Editar
																información
															</Button>
															<Button
																onClick={() => {
																	onSubmit({
																		identification:
																			student.identification,
																		student_id:
																			student.id,
																		id_event:
																			data.event_id,
																		status: "Aprobado",
																		description:
																			"",
																	});
																}}
																className='bg-green-200 hover:bg-green-300 text-neutral-800'
															>
																Aceptar
															</Button>
															<Button
																onClick={() => {
																	setAction(
																		"rejection",
																	);
																	openModal(
																		student,
																	);
																}}
																className='bg-red-200 hover:bg-red-300 text-neutral-800'
															>
																Rechazar
															</Button>
														</section>
													</div>
												),
											)}
										</div>
									</article>
								))
							) : (
								<p className='flex flex-col items-center text-gray-500 mt-8'>
									No hay estudiantes inscritos.
								</p>
							)}
						</section>
					</>
				)}
			</section>
		</>
	);
}
