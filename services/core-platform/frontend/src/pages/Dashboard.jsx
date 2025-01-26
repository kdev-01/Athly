import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import HomeIcon from "../components/Icons/HomeIcon";
import ManageUsersIcon from "../components/Icons/ManageUsersIcon";
import AddUsersIcon from "../components/Icons/AddUsersIcon";

const icons = {
	HomeIcon: HomeIcon,
	ManageUsersIcon: ManageUsersIcon,
	AddUsersIcon: AddUsersIcon,
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

	return (
		<div className='grid grid-cols-[16rem_1fr] h-screen'>
			<aside className='bg-gray-200 text-neutral-800 p-4 flex flex-col justify-between'>
				<ul className='flex flex-col gap-4'>
					<li>
						<NavLink
							to=''
							className='flex gap-3 px-4 py-2 rounded-lg'
						>
							<HomeIcon />
							Home
						</NavLink>
					</li>
					{actions?.actions.map((action, index) => {
						const IconComponent = icons[action.icon];

						return (
							<li key={index}>
								<NavLink
									to={action.href}
									className={({ isActive }) =>
										`flex gap-3 px-4 py-2 rounded-lg ${
											isActive
												? "text-blue-500"
												: "hover:text-blue-500"
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

				<footer className='flex mt-auto'>
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
				</footer>
			</aside>

			<main className='p-6 bg-gray-100 overflow-y-auto'>
				<Outlet />
			</main>
		</div>
	);
}
