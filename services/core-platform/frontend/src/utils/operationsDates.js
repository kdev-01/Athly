export function formattedDate(type, dateString) {
	const [year, month, day] = dateString.split("-").map(Number);
	const localDate = new Date(year, month - 1, day);

	if (type === "long") {
		return localDate.toLocaleDateString("es-ES", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	}

	if (type === "short") {
		return localDate.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		});
	}

	if (type === "custom") {
		const formatter = new Intl.DateTimeFormat("es-ES", { month: "short" });
		const monthText = formatter.format(localDate);
		return `${monthText.charAt(0).toUpperCase() + monthText.slice(1)}, ${day} de ${year}`;
	}

	return localDate.toLocaleDateString("es-ES");
}

export function calculateAge(fechaNacimiento) {
	const [year, month, day] = fechaNacimiento.split("-").map(Number);
	const birthDate = new Date(year, month - 1, day);
	const today = new Date();

	let edad = today.getFullYear() - birthDate.getFullYear();
	const mesActual = today.getMonth();
	const diaActual = today.getDate();

	if (
		mesActual < birthDate.getMonth() ||
		(mesActual === birthDate.getMonth() && diaActual < birthDate.getDate())
	) {
		edad--;
	}

	return edad;
}
