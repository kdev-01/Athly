export default function Button({
	type = "button",
	className = "",
	onClick,
	children,
}) {
	return (
		<button
			type={type}
			className={`p-3 bg-neutral-200 text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 shadow-md font-bold rounded-md ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
