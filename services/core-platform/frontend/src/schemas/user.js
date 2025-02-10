import { z } from "zod";

const emailSchema = z
	.string()
	.nonempty({ message: "El correo electrónico es obligatorio" })
	.max(100, {
		message: "El correo electrónico no debe exceder los 100 caracteres",
	})
	.email({ message: "El formato del correo electrónico no es válido" });

const passwordSchema = z
	.string()
	.nonempty({ message: "La contraseña es obligatoria" })
	.min(6, {
		message: "La contraseña debe tener al menos 6 caracteres",
	})
	.max(30, {
		message: "La contraseña no debe exceder los 30 caracteres",
	});

const namesSchema = z
	.string()
	.nonempty({ message: "El campo es obligatorio" })
	.min(2, {
		message: "Debe tener al menos 2 caracteres",
	})
	.max(50, {
		message: "No debe exceder los 50 caracteres",
	});

const phoneSchema = z
	.string()
	.nonempty({ message: "El número de teléfono es obligatorio" })
	.min(7, {
		message: "El número de teléfono debe tener al menos 7 dígitos",
	})
	.max(15, {
		message: "El número de teléfono no puede tener más de 15 dígitos",
	})
	.regex(/^\d+$/, {
		message: "El número de teléfono solo puede contener dígitos",
	});

const photoSchema = z
	.any()
	.optional()
	.refine(
		(file) => {
			if (!file || file.length === 0) return true;
			if (!(file instanceof FileList)) return false;
			const uploadedFile = file[0];
			return ["image/jpeg", "image/png"].includes(uploadedFile.type);
		},
		{ message: "Solo se permiten imágenes en formato JPG o PNG" },
	);

const selectionMenu = z
	.string()
	.nonempty({ message: "Debe seleccionar una opción" });

const selectionMenuOp = z.string().optional();

export const userLogin = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const userRegistration = z.object({
	first_name: namesSchema,
	last_name: namesSchema,
	phone: phoneSchema,
	photo: photoSchema,
});

export const userForgotPassword = z.object({
	email: emailSchema,
});

export const userRecoverPassword = z
	.object({
		temporaryPassword: passwordSchema,
		newPassword: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Las contraseñas deben coincidir.",
		path: ["confirmPassword"],
	});

export const updateUser = z.object({
	first_name: namesSchema,
	last_name: namesSchema,
	email: emailSchema,
	phone: phoneSchema,
	listRoles: selectionMenuOp,
});

export const addUser = z
	.object({
		email: emailSchema,
		role_name: selectionMenu,
		institution_name: selectionMenuOp,
	})
	.refine(
		(data) =>
			data.role_name !== "Institución educativa" || data.institution_name,
		{
			message: "Debe seleccionar una opción",
			path: ["institution_name"],
		},
	);
