import { z } from "zod";

const today = new Date();
const minDate = new Date(
	today.getFullYear() - 18,
	today.getMonth(),
	today.getDate(),
);
const maxDate = new Date(
	today.getFullYear() - 8,
	today.getMonth(),
	today.getDate(),
);

const photoSchema = z
	.any()
	.refine((fileList) => fileList && fileList.length > 0, {
		message: "La foto es obligatoria.",
	})
	.refine(
		(file) => {
			if (!file || file.length === 0) return true;
			if (!(file instanceof FileList)) return false;
			const uploadedFile = file[0];
			return ["image/jpeg", "image/png"].includes(uploadedFile.type);
		},
		{ message: "Solo se permiten imágenes en formato JPG o PNG" },
	);

const identificationSchema = z
	.string()
	.nonempty({ message: "La cédula es obligatoria" })
	.regex(/^\d+$/, { message: "La cédula solo debe contener números" })
	.max(10, { message: "La cédula debe tener un máximo de 10 dígitos" });

const namesSchema = z
	.string()
	.nonempty({ message: "El campo es obligatorio" })
	.min(2, {
		message: "Debe tener al menos 2 caracteres",
	})
	.max(70, {
		message: "No debe exceder los 70 caracteres",
	});

const textSchema = z
	.string()
	.nonempty({ message: "El campo es obligatorio" })
	.min(2, {
		message: "Debe tener al menos 2 caracteres",
	})
	.max(300, {
		message: "No debe exceder los 300 caracteres",
	});

const checkSchema = z
	.array(z.string())
	.nonempty({ message: "Debes seleccionar al menos un documento" });

const selectionMenu = z
	.union([z.string(), z.number()])
	.refine((val) => val !== "", { message: "Debe seleccionar una opción" });

const birthDateSchema = z
	.string()
	.nonempty({ message: "Debe seleccionar una fecha de nacimiento" })
	.transform((val) => new Date(val))
	.refine((date) => date >= minDate && date <= maxDate, {
		message: "La fecha debe corresponder a una edad entre 8 y 18 años",
	});

const fileSchema = z
	.any()
	.refine((fileList) => fileList && fileList.length > 0, {
		message: "El archivo es obligatorio",
	})
	.refine((fileList) => fileList?.[0]?.type === "application/pdf", {
		message: "El archivo debe ser un PDF",
	});

export const addStudent = z.object({
	photo: photoSchema,
	identification: identificationSchema,
	names: namesSchema,
	surnames: namesSchema,
	gender: selectionMenu,
	date_of_birth: birthDateSchema,
	blood_type: selectionMenu,
	copy_identification: fileSchema,
	authorization: fileSchema,
	enrollment: fileSchema,
});

export const updateStudent = z.object({
	identification: identificationSchema,
	names: namesSchema,
	surnames: namesSchema,
	gender: selectionMenu,
	date_of_birth: birthDateSchema,
	blood_type: selectionMenu,
});

export const rejectionDescription = z.object({
	description: textSchema,
	selectedDocuments: checkSchema,
});

export const getDynamicSchema = (invalidDocs) => {
	const schemaShape = {};

	if (invalidDocs.includes("Foto")) {
		schemaShape.photo = photoSchema;
	}
	if (invalidDocs.includes("Cédula")) {
		schemaShape.copy_identification = fileSchema;
	}
	if (invalidDocs.includes("Autorización")) {
		schemaShape.authorization = fileSchema;
	}
	if (invalidDocs.includes("Matrícula")) {
		schemaShape.enrollment = fileSchema;
	}

	return z.object(schemaShape);
};
