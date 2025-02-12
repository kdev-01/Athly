import { useEffect } from "react";
import CalendarFutbolBasket from "./CalendarFutbolBasket";
import CalendarAtletismo from "./CalendarAtletismo";

const Calendar = ({ teams, scenarios, startDate, sports, event_id }) => {
	const judges = [
		{ id: 4, name: "Carlos Fernández" },
		{ id: 5, name: "María Gómez" },
		{ id: 6, name: "Jorge Martínez" },
		{ id: 7, name: "Luisa Pérez" },
		{ id: 8, name: "Fernando Chávez" },
	];

	// 🔹 Imprime el ID del evento cuando el componente se renderiza
	useEffect(() => {
		console.log("📌 ID del evento recibido en Calendar:", event_id);
	}, [event_id]);

	return (
		<div>
			{sports.name === "Basquet" || sports.name === "Futbol" ? (
				<CalendarFutbolBasket
					teams={teams}
					scenarios={scenarios}
					startDate={startDate}
					judges={judges}
					sport={sports.name}
					eventId={event_id}
				/>
			) : sports.name.includes("Atletismo") ? (
				<CalendarAtletismo
					teams={teams}
					scenarios={scenarios}
					startDate={startDate}
					judges={judges}
					event_id={event_id}
				/>
			) : (
				<p className='text-red-600 text-center font-semibold'>
					Deporte no soportado
				</p>
			)}
		</div>
	);
};

export default Calendar;
