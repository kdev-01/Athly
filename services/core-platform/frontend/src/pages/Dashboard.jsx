import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import logo from "/logo.png";
import LogoutIcon from "../components/Icons/LogoutIcon";
import HomeIcon from "../components/Icons/HomeIcon";
import ManageUsersIcon from "../components/Icons/ManageUsersIcon";
import AddUsersIcon from "../components/Icons/AddUsersIcon";
import ManageEnrollmentsIcon from "../components/Icons/ManageEnrollmentsIcon";
import ListStudents from "../components/Icons/ListStudents";

const icons = {
	HomeIcon: HomeIcon,
	ManageUsersIcon: ManageUsersIcon,
	AddUsersIcon: AddUsersIcon,
	ManageEnrollmentsIcon: ManageEnrollmentsIcon,
	ListStudents: ListStudents,
};

export default function Dashboard() {
	const [actions, setActions] = useState(null);
	const { getRequest } = useFetch();

	useEffect(() => {
		const getUserActions = async () => {
			const response = await getRequest("/user/actions");
			if (response.success) {
				setActions(response.data);
			}
		};

		getUserActions();
	}, []);

	const handleLogout = async () => {
		const response = await getRequest("/user/logout");

		if (response?.success) {
			window.location.href = "/login";
		}
	};

	return (
		<div className='grid grid-cols-[17rem_1fr] h-screen'>
			<aside className='flex flex-col justify-between bg-gray-200 text-neutral-800 rounded-md'>
				<header className='flex justify-center items-center gap-1 p-4'>
					<img src={logo} alt='Logo FDPEN' className='w-16' />
					<h2 className='text-sm text font-bold'>
						Federación Deportiva Estudiantil de Napo
					</h2>
				</header>

				<ul className='flex flex-col gap-2 p-4'>
					<li>
						<NavLink
							to=''
							className='flex items-center gap-2 px-4 py-2 text-sm rounded-lg'
						>
							<HomeIcon />
							Inicio
						</NavLink>
					</li>
					{actions?.actions.map((action, index) => {
						const IconComponent = icons[action.icon];

						return (
							<li key={index}>
								<NavLink
									to={action.href}
									className={({ isActive }) =>
										`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
											isActive
												? "text-blue-400"
												: "hover:text-blue-400"
										}`
									}
								>
									{IconComponent && <IconComponent />}
									{action.label}
								</NavLink>
							</li>
						);
					})}
				</ul>

				<footer className='flex mt-auto border-t border-gray-300 p-4 relative'>
					<img
						src={actions?.profile.photo}
						alt={`Foto de perfil de ${actions?.profile.name}`}
						className='w-12 h-12 rounded-full mr-3'
					/>

					<div className='flex flex-col'>
						<span>{actions?.profile.name}</span>
						<span className='text-xs text-blue-500'>
							{actions?.profile.role}
						</span>
					</div>

					<button
						type='button'
						onClick={handleLogout}
						className='absolute right-5 bottom-[27px] p-1 rounded-lg hover:bg-neutral-900 hover:text-neutral-100'
					>
						<LogoutIcon />
					</button>
				</footer>
			</aside>

			<div className='overflow-y-auto'>
				<Outlet />
			</div>
		</div>
	);
}
