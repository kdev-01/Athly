import SoccerEvent from "../assets/SoccerEvent.png";
import BasketballEvent from "../assets/BasketballEvent.png";
import ChessEvent from "../assets/ChessEvent.png";
import AthleticsEvent from "../assets/AthleticsEvent.png";

export function getImage(sport) {
	switch (sport) {
		case "Fútbol":
			return `url(${SoccerEvent})`;
		case "Básquetbol":
			return `url(${BasketballEvent})`;
		case "Atletismo":
			return `url(${AthleticsEvent})`;
		default:
			return `url(${ChessEvent})`;
	}
}

export function getColors(sport) {
	switch (sport) {
		case "Fútbol":
			return "bg-blue-400 text-blue-50";
		case "Básquetbol":
			return "bg-violet-400 text-violet-50";
		case "Atletismo":
			return "bg-green-500 text-green-50";
		default:
			return "bg-orange-400 text-orange-50";
	}
}

export function getColorTitle(sport) {
	switch (sport) {
		case "Fútbol":
			return "text-blue-400";
		case "Básquetbol":
			return "text-violet-400";
		case "Atletismo":
			return "text-green-500";
		default:
			return "text-orange-400";
	}
}

export function getColorStatus(sport) {
	switch (sport) {
		case "Aprobado":
			return "bg-green-500 text-green-50";
		case "Pendiente":
			return "bg-orange-400 text-orange-50";
		default:
			return "bg-red-500 text-red-50";
	}
}
