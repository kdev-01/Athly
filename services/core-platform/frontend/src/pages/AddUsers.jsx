import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { useFetch } from "../hooks/useFetch";
import { addUser } from "../schemas/user";
import InputField from "../components/InputField";
import ScrollableMenu from "../components/ScrollableMenu";
import Button from "../components/Button";
import DeleteIcon from "../components/Icons/DeleteIcon";
import EditIcon from "../components/Icons/EditIcon";

export default function AddUsers() {
	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(addUser),
	});
	const { postRequest } = useFetch();
	const [users, setUsers] = useState([]);
	const selectedRole = watch("role_name");

	useEffect(() => {
		if (selectedRole !== "Institución educativa") {
			reset(
				{ institution_name: "" },
				{ keepDirty: false, keepTouched: false },
			);
		}
	}, [selectedRole, reset]);

	const handleAddUser = (data) => {
		if (users.length >= 10) {
			toast.error("No puedes agregar más de 10 usuarios.");
			return;
		}

		const emailExists = users.some((user) => user.email === data.email);
		if (emailExists) {
			toast.error("Este correo ya está en la lista.");
			return;
		}

		setUsers([...users, data]);
		reset({
			email: "",
			role_name: "",
			institution_name: "",
		});
	};

	const handleEditUser = (index) => {
		const userToEdit = users[index];
		reset(userToEdit);
		handleDeleteUser(index);
	};

	const handleDeleteUser = (index) => {
		const updatedUsers = users.filter((_, i) => i !== index);
		setUsers(updatedUsers);
	};

	const handleSendUsers = async () => {
		toast("¿Está seguro de enviar los accesos?", {
			action: {
				label: "Confirmar",
				onClick: () => {
					if (users.length === 0) {
						toast.error("No hay usuarios para enviar.");
						return;
					}

					const filteredUsers = users.map((user) => {
						if (user.role_name !== "Institución educativa") {
							const { institution_name, ...rest } = user;
							return rest;
						}
						return user;
					});

					const response = postRequest(
						filteredUsers,
						"/user/load/users",
					);
					toast.promise(response, {
						loading: "Cargando...",
						success: (data) => {
							setUsers([]);
							return data.message;
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
		<div className='min-h-screen bg-gray-100 p-6 flex justify-center items-start space-x-6'>
			<section className='bg-white shadow-md rounded-lg p-10 w-1/3'>
				<h2 className='text-xl font-bold mb-4'>Agregar Usuario</h2>
				<form
					onSubmit={handleSubmit(handleAddUser)}
					className='flex flex-col gap-4'
				>
					<InputField
						label='Correo electrónico'
						type='text'
						id='email'
						register={register}
						errors={errors}
					/>

					<ScrollableMenu
						label='Seleccionar rol'
						id='role_name'
						register={register}
						errors={errors}
						endpoint={"/rol/get"}
					/>

					{selectedRole === "Institución educativa" && (
						<ScrollableMenu
							label='Seleccionar la institución educativa'
							id='institution_name'
							register={register}
							errors={errors}
							endpoint={"/edu/get"}
						/>
					)}

					<Button type='submit' className='mt-4'>
						Agregar
					</Button>
				</form>
			</section>

			<section className='flex flex-col bg-white shadow-md rounded-lg p-6 w-2/3'>
				<h2 className='text-xl font-bold mb-4'>Usuarios Agregados</h2>
				<table className='w-full text-sm'>
					<thead className='bg-neutral-800 text-neutral-100 uppercase'>
						<tr>
							<th className='p-2 text-left'>Correo</th>
							<th className='p-2 text-left'>Rol</th>
							<th className='p-2 text-left'>Colegio</th>
							<th className='p-2 text-center'>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
							<tr key={index} className='text-center'>
								<td className='border-b border-neutral-800 p-2 text-left'>
									{user.email}
								</td>
								<td className='border-b border-neutral-800 p-2 text-left'>
									{user.role_name}
								</td>
								<td className='border-b border-neutral-800 p-2 text-left'>
									{user.institution_name || "N/A"}
								</td>
								<td className='border-b border-neutral-800 p-2 text-center'>
									<button
										type='button'
										onClick={() => handleEditUser(index)}
										className='bg-blue-400 text-neutral-100 rounded-md mr-3 p-1'
									>
										<EditIcon />
									</button>
									<button
										type='button'
										onClick={() => handleDeleteUser(index)}
										className='bg-red-400 text-neutral-100 rounded-md p-1'
									>
										<DeleteIcon />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<Button
					type='button'
					onClick={handleSendUsers}
					className='mt-20'
				>
					Enviar accesos
				</Button>
			</section>

			<Toaster position='top-right' />
		</div>
	);
}
