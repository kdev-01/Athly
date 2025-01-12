import { z } from "zod";

const emailSchema = z
	.string()
	.nonempty({ message: "El correo electrónico es obligatorio." })
	.max(100, {
		message: "El correo electrónico no debe exceder los 100 caracteres.",
	})
	.email({ message: "El formato del correo electrónico no es válido." });

const passwordSchema = z
	.string()
	.nonempty({ message: "La contraseña es obligatoria." })
	.min(6, {
		message: "La contraseña debe tener al menos 6 caracteres.",
	})
	.max(30, {
		message: "La contraseña no debe exceder los 30 caracteres.",
	});

export const userLogin = z.object({
	email: emailSchema,
	password: passwordSchema,
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
