import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

export default function StudentInformation({ id }) {
	const { loading, error, getRequest } = useFetch();
	const [pdfBase64, setPdfBase64] = useState(null);

	useEffect(() => {
		if (id) {
			const fetchData = async () => {
				const response = await getRequest(
					`/student/get?student_id=${id}`,
				);
				if (error) {
					toast.error(error);
				}
				if (!response.success) {
					toast.error(response.message);
				} else {
					setPdfBase64(response.data.identification_pdf);
				}
			};
			fetchData();
		}
	}, [id]);

	return (
		<>
			{loading ? (
				<p>Cargando documentos...</p>
			) : error ? (
				<p>Error al cargar el PDF.</p>
			) : (
				<>
					<object
						data={`data:application/pdf;base64,${pdfBase64}`}
						type='application/pdf'
						width='100%'
						height='750'
					>
						<p>No se puede visualizar el PDF.</p>
					</object>
				</>
			)}
		</>
	);
}
