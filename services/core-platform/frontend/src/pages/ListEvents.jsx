import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useFetch } from "../hooks/useFetch";
import { formattedDate } from "../utils/operationsDates";
import { getImage, getColors, getColorTitle } from "../utils/getStyles";
import AddStudents from "../components/AddStudents";
import ArrowLeftIcon from "../components/Icons/ArrowLeftIcon";

export default function ListEvents() {
	const [moreInfo, setMoreInfo] = useState(null);
	const { data, loading, error, getRequest } = useFetch();
	const today = new Date();

	useEffect(() => {
		const fetchData = async () => {
			const response = await getRequest("/api/events/available");

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

	return (
		<main className='m-8 p-8 bg-white rounded-lg'>
			{loading ?? (
				<p className='flex flex-col items-center text-gray-500 mt-8'>
					Cargando...
				</p>
			)}
			{moreInfo ? (
				<>
					<button
						type='button'
						onClick={() => setMoreInfo(null)}
						className='flex items-center gap-1 text-neutral-600 hover:text-neutral-900'
					>
						<ArrowLeftIcon />
						<span className='text-sm font-medium'>Regresar</span>
					</button>
					<AddStudents data={moreInfo} />
				</>
			) : (
				<>
					<h1 className='text-2xl mb-10'>Eventos disponibles</h1>
					<section className='grid grid-cols-1s md:grid-cols-2 lg:grid-cols-2 gap-6'>
						{data.map((event) => (
							<article
								key={event.event_id}
								className={`relative p-8 rounded-md shadow-lg hover:shadow-md transition-shadow ${
									new Date(event.registration_start_date) <=
										today &&
									event.students_count < event.max_players
										? "cursor-pointer"
										: "cursor-default"
								}`}
								style={{
									backgroundImage: getImage(event.sport.name),
									backgroundSize: "200px",
									backgroundPositionX: "100%",
									backgroundPositionY: "center",
									backgroundRepeat: "no-repeat",
								}}
								onClick={
									new Date(event.registration_start_date) <=
										today &&
									event.students_count < event.max_players
										? () => handleCardClick(event)
										: undefined
								}
							>
								<span
									className={`absolute right-6 p-2 rounded-xl text-xs font-extrabold ${getColors(
										event.sport.name,
									)}`}
								>
									{event.sport.name}
								</span>

								<h2 className='text-lg font-medium'>
									{event.name}
								</h2>

								<p
									className={`text-sm mb-3 ${getColorTitle(
										event.sport.name,
									)}`}
								>
									{`${event.category.name} - ${
										event.sport.name !== "Atletismo"
											? "Grupal"
											: "Individual"
									}`}
								</p>

								<article>
									<h3 className='font-medium text-gray-600 text-sm'>
										Inscripciones:
									</h3>
									<p className='text-sm'>
										<span className='font-medium text-gray-600'>
											Inicio:
										</span>{" "}
										{formattedDate(
											"long",
											event.registration_start_date,
										)}
									</p>

									<p className='text-sm'>
										<span className='font-medium text-gray-600'>
											Finalización:
										</span>{" "}
										{formattedDate(
											"long",
											event.registration_end_date,
										)}
									</p>

									{event.students_count > 0 && (
										<p
											className={`mt-3 text-sm font-medium ${
												event.students_count >=
												event.min_players
													? "text-green-400"
													: "text-red-400"
											}`}
										>
											{event.students_count >=
											event.min_players
												? "Completo"
												: `Faltan ${event.min_players - event.students_count} jugadores para completar el equipo`}
										</p>
									)}
								</article>
							</article>
						))}
					</section>
				</>
			)}

			<Toaster position='top-right' />
		</main>
	);
}
