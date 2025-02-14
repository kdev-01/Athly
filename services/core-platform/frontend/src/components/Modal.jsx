import CloseIcon from "./Icons/CloseIcon";

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	className = "w-2/5 h-auto",
}) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
			<div
				className={`bg-neutral-100 p-7 rounded max-h-[80vh] overflow-auto ${className}`}
			>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-bold mb-3'>{title}</h2>
					<button
						type='button'
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700'
					>
						<CloseIcon />
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}
