export default function InputField({
	label,
	type,
	id,
	placeholder,
	register,
	errors,
}) {
	return (
		<label className='flex flex-col gap-1'>
			{label}
			<input
				type={type}
				id={id}
				{...register(id)}
				placeholder={placeholder}
				className='p-2 border rounded-md'
			/>
			{errors[id] && (
				<span className='text-red-500 text-xs bottom-4 left-0'>
					{errors[id].message}
				</span>
			)}
		</label>
	);
}
