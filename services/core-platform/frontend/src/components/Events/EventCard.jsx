import React from "react";

const EventCard = ({
	eventName,
	startDate,
	endDate,
	sportName,
	categoryName,
	onClick,
}) => {
	const getStatus = (endDate, startDate) => {
		const today = new Date();
		const eventEndDate = new Date(endDate);
		const eventStartDate = new Date(startDate);

		if (eventStartDate > today) {
			return { text: "Sin empezar", color: "bg-gray-500" };
		}

		return eventEndDate >= today
			? { text: "En progreso", color: "bg-green-600" }
			: { text: "Finalizado", color: "bg-red-600" };
	};

	const status = getStatus(endDate, startDate);

	return (
		<div
			className='relative border  rounded-lg overflow-hidden shadow-md hover:bg-gray-100 cursor-pointer'
			onClick={onClick}
		>
			{/* Barra negra con el nombre */}
			<div className=' text-center font-bold'>
				{eventName}
				<div
					className={`absolute top-2 right-2 px-3 py-1 text-white text-sm font-bold rounded-full ${status.color}`}
				>
					{status.text}
				</div>
			</div>

			{/* Contenido de la tarjeta */}
			<div className='bg-gray-50 p-4'>
				<p className='text-gray-700'>
					<strong className='text-gray-900'>Fecha de Inicio:</strong>{" "}
					{startDate}
				</p>
				<p className='text-gray-700'>
					<strong className='text-gray-900'>Fecha de Fin:</strong>{" "}
					{endDate}
				</p>
				<p className='text-gray-700'>
					<strong className='text-gray-900'>Cempetencia:</strong>{" "}
					{sportName}
				</p>
				<p className='text-gray-700'>
					<strong className='text-gray-900'>Categoría:</strong>{" "}
					{categoryName}
				</p>
			</div>

			{/* Estado del evento */}
		</div>
	);
};

export default EventCard;
