export default function Button({
	type = "button",
	className = "",
	onClick,
	children,
}) {
	return (
		<button
			type={type}
			className={`p-3 bg-neutral-900 text-neutral-100 font-bold rounded-md ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
