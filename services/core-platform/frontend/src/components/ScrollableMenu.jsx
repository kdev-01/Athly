import { useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

export default function ScrollableMenu({
	label,
	id,
	register,
	errors = false,
	endpoint,
	includeAll = false,
}) {
	const { data, loading, getRequest } = useFetch();

	useEffect(() => {
		getRequest(endpoint);
	}, [endpoint]);

	return (
		<label className='flex flex-col gap-1'>
			{label}
			<select
				id={id}
				{...register(id)}
				className='p-2 border rounded-md'
				disabled={loading}
				defaultValue=''
			>
				{loading && <option>Cargando...</option>}
				{!loading && includeAll ? (
					<option key='all' value='Todos'>
						Todos
					</option>
				) : (
					<option value='' disabled>
						Seleccione una opción
					</option>
				)}
				{!loading &&
					data.map((option) => (
						<option key={option.id} value={option.value}>
							{option.value}
						</option>
					))}
			</select>

			{errors[id] && (
				<span className='text-red-500 text-xs bottom-4 left-0'>
					{errors[id].message}
				</span>
			)}
		</label>
	);
}
