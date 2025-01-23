import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { updateUser } from "../schemas/user";
import { useFetch } from "../hooks/useFetch";
import Modal from "../components/Modal";
import ScrollableMenu from "../components/ScrollableMenu";
import Button from "../components/Button";
import InputField from "../components/InputField";
import DeleteIcon from "../components/Icons/DeleteIcon";
import EditIcon from "../components/Icons/EditIcon";

export default function UsersTable() {
	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateUser),
	});
	const { data, loading, error, getRequest } = useFetch();
	const [authenticated, setAuthenticated] = useState(true);
	const [editModal, setEditModal] = useState(false);
	const [editUser, setEditUser] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const response = await getRequest("/user/get/users");

			if (error) {
				toast.error(error);
			}

			if (!response.success) {
				toast.error(response.message);
				await new Promise((resolve) => setTimeout(resolve, 3000));
			} else {
				setAuthenticated(false);
			}
		};

		fetchData();
	}, []);

	const listRoles = watch("listRoles", "Todos");
	const nameSearch = watch("nameSearch", "");

	const filteredUsers = data.filter((user) => {
		const matchesRole = listRoles === "Todos" || user.role === listRoles;
		const matchesName = `${user.first_name} ${user.last_name}`
			.toLowerCase()
			.includes(nameSearch.toLowerCase());

		return matchesRole && matchesName;
	});

	const handleDeleteUser = () => {
		console.log("hola");
	};

	const openEditModal = (user) => {
		setEditUser(user);
		setEditModal(true);
		reset({
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone: user.phone,
			role: user.role.name,
		});
	};

	const saveEdit = (data) => {
		console.log("Edited data:", {
			...editUser,
			...data,
			role: { ...editUser.role, name: data.role },
		});
		setEditModal(false);
		setEditUser(null);
	};

	return (
		<div className='p-8'>
			<header className='flex flex-row items-center gap-6 mb-6'>
				<label className='flex flex-col gap-1 w-60'>
					Buscar por nombre
					<input
						id='nameSearch'
						type='text'
						{...register("nameSearch")}
						className='p-2 border rounded-md w-60'
					/>
				</label>

				<ScrollableMenu
					label='Seleccionar rol'
					id='listRoles'
					register={register}
					endpoint={"/rol/get"}
					includeAll={true}
				/>
			</header>

			{loading || authenticated ? (
				<h1 className='text-center'>Cargando...</h1>
			) : (
				<main className='overflow-hidden rounded-md'>
					<table className='w-full text-sm'>
						<thead className='bg-neutral-800 text-neutral-100 uppercase'>
							<tr>
								<th className='p-2 text-left'>Nombre</th>
								<th className='p-2 text-left'>
									Correo electrónico
								</th>
								<th className='p-2 text-left'>
									Número de teléfono
								</th>
								<th className='p-2 text-left'>Rol</th>
								<th className='p-2 text-center'>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr
									key={user.id}
									className='hover:bg-neutral-200'
								>
									<td className='border-b border-neutral-800 p-2 text-left'>
										<div className='flex items-center gap-2'>
											<img
												src={user.photo_url}
												alt={`Foto de perfil de ${user.first_name}`}
												className='w-10 h-10 rounded-full'
											/>
											{`${user.first_name} ${user.last_name}`}
										</div>
									</td>
									<td className='border-b border-neutral-800 p-2 text-left'>
										{user.email}
									</td>
									<td className='border-b border-neutral-800 p-2 text-left'>
										{user.phone}
									</td>
									<td className='border-b border-neutral-800 p-2 text-left'>
										<div className='flex flex-col'>
											<span className='font-medium'>
												{user.role}
											</span>
											{user.name_institution ? (
												<span className='text-xs text-blue-500 font-semibold'>
													{user.name_institution}
												</span>
											) : user.status_judge !== null ? (
												<span
													className={`text-xs font-semibold ${
														user.status_judge
															? "text-red-600"
															: "text-green-600"
													}`}
												>
													{user.status_judge
														? "Ocupado"
														: "Libre"}
												</span>
											) : null}
										</div>
									</td>
									<td className='border-b border-neutral-800 p-2 text-center'>
										<button
											type='button'
											onClick={() => openEditModal(user)}
											className='bg-blue-400 text-neutral-100 rounded-md mr-3 p-1'
										>
											<EditIcon />
										</button>

										<button
											type='button'
											className='bg-red-400 text-neutral-100 rounded-md p-1'
										>
											<DeleteIcon />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</main>
			)}

			<Modal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				title='Editar'
			>
				<form
					onSubmit={handleSubmit(saveEdit)}
					className='flex flex-col gap-5'
				>
					<InputField
						label='Nombre'
						type='text'
						id='first_name'
						register={register}
						errors={errors}
					/>

					<InputField
						label='Apellido'
						type='text'
						id='last_name'
						register={register}
						errors={errors}
					/>

					<InputField
						label='Correo electrónico'
						type='text'
						id='email'
						register={register}
						errors={errors}
					/>

					<InputField
						label='Número de teléfono'
						type='text'
						id='phone'
						register={register}
						errors={errors}
					/>

					<ScrollableMenu
						label='Seleccionar rol'
						id='listRoles'
						register={register}
						endpoint={"/rol/get"}
						includeAll={true}
					/>
					<Button type='submit'>Guardar</Button>
				</form>
			</Modal>
			<Toaster position='top-right' />
		</div>
	);
}
