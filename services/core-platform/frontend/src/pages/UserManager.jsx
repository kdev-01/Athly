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
	const { data, setData, loading, error, getRequest } = useFetch();
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
			}
		};

		fetchData();
	}, []);

	const roles = watch("roles", "Todos");
	const nameSearch = watch("nameSearch", "");

	const filteredUsers = data.filter((user) => {
		const matchesRole = roles === "Todos" || user.role === roles;
		const matchesName = `${user.first_name} ${user.last_name}`
			.toLowerCase()
			.includes(nameSearch.toLowerCase());

		return matchesRole && matchesName;
	});

	const openEditModal = (user) => {
		setEditUser(user);
		setEditModal(true);
		reset({
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone: user.phone,
		});
	};

	const saveEdit = (data) => {
		const new_data = {
			...editUser,
			...data,
		};

		toast(
			`¿Está seguro de editar la información del usuario ${new_data.first_name}?`,
			{
				action: {
					label: "Confirmar",
					onClick: async () => {
						const response = await fetch(
							`http://localhost:8000/user/put?user_id=${new_data.id}`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									first_name: new_data.first_name,
									last_name: new_data.last_name,
									phone: new_data.phone,
									email: new_data.email,
								}),
								credentials: "include",
							},
						);

						const data = await response.json();
						toast.promise(Promise.resolve(data), {
							loading: "Cargando...",
							success: (data) => {
								if (data.success) {
									setData((prevUsers) =>
										prevUsers.map((user) =>
											user.id === data.data.user_id
												? { ...user, ...data.data }
												: user,
										),
									);

									return data.message;
								}

								throw new Error(data.message);
							},
							error: (err) => {
								return err.message;
							},
						});
					},
				},
			},
		);

		setEditModal(false);
		setEditUser(null);
	};

	const handleDeleteUser = (user) => {
		toast(`¿Está seguro de eliminar al usuario ${user.first_name}?`, {
			action: {
				label: "Confirmar",
				onClick: async () => {
					const response = await fetch(
						`http://localhost:8000/user/delete?user_id=${user.id}`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							credentials: "include",
						},
					);

					const data = await response.json();
					toast.promise(Promise.resolve(data), {
						loading: "Cargando...",
						success: (data) => {
							if (data.success) {
								return data.message;
							}

							throw new Error(data.message);
						},
						error: (err) => {
							return err.message;
						},
					});
				},
			},
		});
	};

	return (
		<div className='m-8 p-8 h-full bg-white rounded-lg'>
			<header className='flex flex-row items-center justify-between mb-5'>
				<h1 className='text-2xl font-bold'>Administrar usuarios</h1>

				<section className='flex gap-4'>
					<label className='flex flex-col gap-1 w-60'>
						Buscar por nombre
						<input
							id='nameSearch'
							type='text'
							placeholder='Kevin Tapia'
							{...register("nameSearch")}
							className='p-2 border rounded-md w-60'
						/>
					</label>

					<ScrollableMenu
						label='Seleccionar rol'
						id='roles'
						register={register}
						endpoint={"/rol/get"}
						includeAll={true}
					/>
				</section>
			</header>

			{loading ? (
				<h1 className='text-center'>Cargando...</h1>
			) : (
				<main className='overflow-hidden rounded-md'>
					<table className='w-full text-sm'>
						<thead className='bg-blue-400 text-blue-50 uppercase'>
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
									className='hover:bg-neutral-50'
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
												<span className='text-xs text-blue-400 font-semibold'>
													{user.name_institution}
												</span>
											) : null}
										</div>
									</td>
									<td className='border-b border-neutral-800 p-2 text-center'>
										<button
											type='button'
											onClick={() => openEditModal(user)}
											className='bg-neutral-200 text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 rounded-md mr-3 p-1'
										>
											<EditIcon />
										</button>

										<button
											type='button'
											onClick={() =>
												handleDeleteUser(user)
											}
											className='bg-neutral-200 text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 rounded-md p-1'
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
				title='Editar usuario'
			>
				<form
					onSubmit={handleSubmit(saveEdit)}
					className='flex flex-col gap-4'
				>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
					</div>

					<Button type='submit' className='mt-3 w-full'>
						Guardar
					</Button>
				</form>
			</Modal>
			<Toaster position='top-right' />
		</div>
	);
}
