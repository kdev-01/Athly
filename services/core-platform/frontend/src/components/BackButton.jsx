import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "./Icons/ArrowLeftIcon";

export default function BackButton({ to, children }) {
	const navigate = useNavigate();

	return (
		<button
			type='button'
			onClick={() => navigate(to)}
			className='flex items-center gap-1 text-neutral-600 hover:text-neutral-900'
		>
			<ArrowLeftIcon />
			<span className='text-sm font-medium'>{children}</span>
		</button>
	);
}
