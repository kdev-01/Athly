import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useFetch } from "../hooks/useFetch";
import { formattedDate } from "../utils/operationsDates";
import { getImage, getColors, getColorTitle } from "../utils/getStyles";
import ListStudents from "../components/ListStudents";
import ArrowLeftIcon from "../components/Icons/ArrowLeftIcon";

export default function ManageEnrollments() {
	const [moreInfo, setMoreInfo] = useState(null);
	const [selectedSport, setSelectedSport] = useState("");
	const { data, loading, error, getRequest } = useFetch();
	const today = new Date();

	useEffect(() => {
		const fetchData = async () => {
			const response = await getRequest("/api/events/upcoming");

			if (error) {
				toast.error(error);
			}

			if (!response.success) {
				toast.error(response.message);
			}
		};

		fetchData();
	}, []);

	const handleCardClick = (event) => {
		setMoreInfo(event);
	};

	const uniqueSports = [...new Set(data.map((event) => event.sport.name))];

	const filteredEvents = selectedSport
		? data.filter((event) => event.sport.name === selectedSport)
		: data;

	return (
		<>
			<main className='m-8 p-8 bg-white rounded-lg'>
				{loading && <p>Cargando eventos...</p>}
				{moreInfo ? (
					<>
						<button
							type='button'
							onClick={() => setMoreInfo(null)}
							className='flex items-center gap-1 text-neutral-600 hover:text-neutral-900'
						>
							<ArrowLeftIcon />
							<span className='text-sm font-medium'>
								Regresar
							</span>
						</button>
						<ListStudents data={moreInfo} />
					</>
				) : (
					<>
						<section className='flex justify-between items-center'>
							<h1 className='text-2xl font-bold'>
								Inscripciones realizadas
							</h1>

							<label className='block mb-4'>
								<span className='text-gray-700'>
									Filtrar por deporte:
								</span>
								<select
									value={selectedSport}
									onChange={(e) =>
										setSelectedSport(e.target.value)
									}
									className='block w-full mt-1 p-2 border border-gray-300 rounded-md'
								>
									<option value=''>Todos</option>
									{uniqueSports.map((sport) => (
										<option key={sport} value={sport}>
											{sport}
										</option>
									))}
								</select>
							</label>
						</section>

						<section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
							{filteredEvents.map((event) => (
								<article
									key={event.event_id}
									className={`relative p-8 rounded-md shadow-lg hover:shadow-md transition-shadow ${
										new Date(
											event.registration_start_date,
										) > today
											? "cursor-default"
											: "cursor-pointer"
									}`}
									style={{
										backgroundImage: getImage(
											event.sport.name,
										),
										backgroundSize: "200px",
										backgroundPositionX: "100%",
										backgroundPositionY: "center",
										backgroundRepeat: "no-repeat",
									}}
									onClick={() => handleCardClick(event)}
								>
									<span
										className={`absolute right-6 p-2 rounded-xl text-xs font-extrabold ${getColors(
											event.sport.name,
										)}`}
									>
										{(() => {
											const remainingDays =
												Math.ceil(
													(new Date(
														event.registration_end_date,
													).setHours(0, 0, 0, 0) -
														new Date().setHours(
															0,
															0,
															0,
															0,
														)) /
														(1000 * 60 * 60 * 24),
												) + 1;

											return remainingDays <= 0
												? "Inscripción finalizada"
												: `Termina en ${remainingDays} ${remainingDays === 1 ? "día" : "días"}`;
										})()}
									</span>

									<span className='text-[11px]'>
										{formattedDate(
											"custom",
											event.start_date,
										)}
										{" / "}
										{formattedDate(
											"custom",
											event.end_date,
										)}
									</span>

									<h2 className='text-lg font-medium'>
										{event.name}
									</h2>

									<p
										className={`text-sm mb-3 ${getColorTitle(
											event.sport.name,
										)}`}
									>
										{event.sport.name}
										{" / "}
										{event.category.name}
									</p>

									<article>
										<p className='text-sm'>
											<span className='font-medium text-gray-600'>
												Estudiantes inscritos:
											</span>{" "}
											{event.institutions.reduce(
												(acc, institution) =>
													acc +
													institution.students.length,
												0,
											)}
										</p>
									</article>

									<article>
										<p className='text-sm'>
											<span className='font-medium text-gray-600'>
												Instituciones participantes:
											</span>{" "}
											{event.institutions.length}
										</p>
									</article>
								</article>
							))}
						</section>
					</>
				)}
			</main>

			<Toaster position='top-right' />
		</>
	);
}
