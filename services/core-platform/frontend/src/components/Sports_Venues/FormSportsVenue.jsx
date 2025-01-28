import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const FormSportsVenue = ({ onVenueCreated, venueToEdit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [sports, setSports] = useState([]);

  // Cargar deportes disponibles al montar el componente
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/sports/")
      .then((response) => setSports(response.data))
      .catch((error) => console.error("Error al cargar los deportes:", error));
  }, []);

  // Precargar datos en caso de editar un venue
  useEffect(() => {
    if (venueToEdit) {
      Object.keys(venueToEdit).forEach((key) => {
        setValue(key, venueToEdit[key]);
      });
    }
  }, [venueToEdit, setValue]);

  const onSubmit = (data) => {
    if (venueToEdit) {
      // Actualizar un SportsVenue existente
      axios
        .put(`http://localhost:8000/api/sports_venues/${venueToEdit.venue_id}/`, data)
        .then(() => {
          alert("Lugar deportivo actualizado exitosamente.");
          onVenueCreated();
        })
        .catch((error) => {
          alert("Error al actualizar el lugar deportivo.");
          console.error("Error:", error);
        });
    } else {
      // Crear un nuevo SportsVenue
      axios
        .post("http://localhost:8000/api/sports_venues/", data)
        .then(() => {
          alert("Lugar deportivo creado exitosamente.");
          onVenueCreated();
        })
        .catch((error) => {
          alert("Error al crear el lugar deportivo.");
          console.error("Error:", error);
        });
    }
  };

  return (

    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md w-full max-w-3xl mx-auto">

        
      {/* Barra negra superior */}
      <div className="bg-black text-white text-center font-bold py-3">
        {venueToEdit ? "Editar Lugar Deportivo" : "Crear Lugar Deportivo"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-6 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-gray-700 font-semibold">Nombre:</label>
          <input
            type="text"
            {...register("name", { required: "El nombre es obligatorio" })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-gray-700 font-semibold">Ubicación:</label>
          <input
            type="text"
            {...register("location", { required: "La ubicación es obligatoria" })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* URL de la imagen */}
        <div>
          <label className="block text-gray-700 font-semibold">URL de la Imagen:</label>
          <input
            type="url"
            {...register("image_url", {
              required: "La URL de la imagen es obligatoria",
              pattern: {
                value: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                message: "Debe ser una URL válida",
              },
            })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.image_url && (
            <p className="text-red-500 text-sm">{errors.image_url.message}</p>
          )}
        </div>

        {/* Estado */}
        <div>
          <label className="block text-gray-700 font-semibold">Estado:</label>
          <select
            {...register("status", { required: "El estado es obligatorio" })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Selecciona un estado</option>
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>

        {/* Deporte */}
        <div>
          <label className="block text-gray-700 font-semibold">Deporte:</label>
          <select
            {...register("sport_id", { required: "El deporte es obligatorio" })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Selecciona un deporte</option>
            {sports.map((sport) => (
              <option key={sport.sport_id} value={sport.sport_id}>
                {sport.name}
              </option>
            ))}
          </select>
          {errors.sport_id && (
            <p className="text-red-500 text-sm">{errors.sport_id.message}</p>
          )}
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
        >
          {venueToEdit ? "Actualizar Lugar Deportivo" : "Crear Lugar Deportivo"}
        </button>
      </form>
    </div>
  );
};

export default FormSportsVenue;
