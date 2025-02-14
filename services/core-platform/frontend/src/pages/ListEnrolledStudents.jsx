import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { Toaster, toast } from "sonner";
import { calculateAge } from "../utils/operationsDates";
import { getImage, getColorStatus, getColorTitle } from "../utils/getStyles";
import ModifyInformation from "../components/ModifyInformation";
import Modal from "../components/Modal";
import BloodTypeIcon from "../components/Icons/BloodTypeIcon";
import TimeIcon from "../components/Icons/TimeIcon";
import BoyIcon from "../components/Icons/BoyIcon";
import WomanIcon from "../components/Icons/WomanIcon";

export default function ListEnrolledStudents() {
	const [modal, setModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const { data, loading, error, getRequest } = useFetch();

	useEffect(() => {
		const fetchData = async () => {
			const response = await getRequest("/api/events/students");

			if (error) {
				toast.error(error);
			}

			if (!response.success) {
				toast.error(response.message);
			}
		};

		fetchData();
	}, []);

	const openModal = (student, event_id) => {
		setSelectedStudent({ ...student, event_id });
		setModal(true);
	};

	const closeModal = () => {
		setModal(false);
		setSelectedStudent(null);
	};

	return (
		<main className='m-8 p-8 bg-white rounded-lg'>
			{loading ?? (
				<p className='flex flex-col items-center text-gray-500 mt-8'>
					Cargando...
				</p>
			)}
			{selectedStudent ? (
				<>
					<Modal
						isOpen={modal}
						onClose={closeModal}
						title='Corrección de documentos'
						className='w-2/5 h-auto'
					>
						<ModifyInformation student={selectedStudent} />
					</Modal>
				</>
			) : (
				<section>
					<header className='flex flex-col mt-5 p-5 bg-neutral-100 rounded-xl'>
						<h1 className='text-2xl font-bold'>
							{data[0]?.institution_name}
						</h1>
						<span>Estudiantes inscritos</span>
					</header>

					{data.length > 0 ? (
						data.map((event) => (
							<article key={event.event_id} className='p-2 mt-6'>
								<div className='flex justify-between text-[18px] font-semibold border-b-2 mb-7'>
									<h2>{event.name}</h2>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
									{event.students.map((student) => (
										<div
											key={student.id}
											onClick={
												student.status === "Rechazado"
													? () =>
															openModal(
																student,
																event.event_id,
															)
													: null
											}
											className={`bg-gray-50 relative p-5 rounded-md shadow-lg hover:shadow-md transition-shadow ${
												student.status === "Rechazado"
													? "cursor-pointer"
													: "cursor-default"
											}`}
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
													src={student.photo}
													alt={`Foto de ${student.name}`}
													className='w-20 h-20 object-contain rounded-xl'
												/>

												<article className='flex flex-col ml-3'>
													<p className='font-bold'>
														{student.name}{" "}
														{student.surname}
													</p>

													<span className='text-xs mb-3'>
														{student.identification}
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
															{student.blood_type}
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

											<section
												className='bg-neutral-100 mt-4 p-3 rounded-xl text-sm'
												style={{
													backgroundImage: getImage(
														event.sport.name,
													),
													backgroundSize: "200px",
													backgroundPositionX: "100%",
													backgroundPositionY: "10%",
													backgroundRepeat:
														"no-repeat",
												}}
											>
												<div className='flex flex-col gap-1'>
													<p>
														<h3
															className={`font-medium ${getColorTitle(
																event.sport
																	.name,
															)}`}
														>
															Institución
															educativa:
														</h3>
														{event.institution_name}
													</p>

													<p>
														<h3
															className={`font-medium ${getColorTitle(
																event.sport
																	.name,
															)}`}
														>
															Evento:
														</h3>
														{event.name}
													</p>

													<p>
														<h3
															className={`font-medium ${getColorTitle(
																event.sport
																	.name,
															)}`}
														>
															Categoría:
														</h3>
														{event.category.name}
													</p>
												</div>
											</section>
										</div>
									))}
								</div>
							</article>
						))
					) : (
						<p className='flex flex-col items-center text-gray-500 mt-8'>
							No se encontraron estudiantes.
						</p>
					)}
				</section>
			)}
			<Toaster position='top-right' />
		</main>
	);
}
