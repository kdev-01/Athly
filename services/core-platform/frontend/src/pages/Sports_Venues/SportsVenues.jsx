import React, { useEffect, useState } from "react";
import axios from "axios";

const SportsVenuesTable = () => {
  const [sportsVenues, setSportsVenues] = useState([]);

  useEffect(() => {
    fetchSportsVenues();
  }, []);

  const fetchSportsVenues = () => {
    axios
      .get("http://localhost:8000/api/sports_venues/")
      .then((response) => setSportsVenues(response.data))
      .catch((error) => console.error("Error al obtener los lugares deportivos:", error));
  };

  const openEditModal = (venue) => {
    console.log("Editar:", venue);
    // Lógica para abrir el modal de edición
  };

  const deleteVenue = (venueId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este lugar deportivo?")) {
      axios
        .delete(`http://localhost:8000/api/sports_venues/${venueId}/`)
        .then(() => {
          alert("Lugar deportivo eliminado exitosamente.");
          fetchSportsVenues();
        })
        .catch((error) => console.error("Error al eliminar el lugar deportivo:", error));
    }
  };

  return (
    <div className="overflow-x-auto">
    <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Escenarios Deportivos</h1>
        <button
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Crear Evento
        </button>
      </div>  
        
      <table className="w-full text-sm">
        <thead className="bg-neutral-800 text-neutral-100 uppercase">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Ubicación</th>
            <th className="p-2 text-left">Deporte</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sportsVenues.length > 0 ? (
            sportsVenues.map((venue) => (
              <tr key={venue.venue_id} className="hover:bg-neutral-200">
                <td className="border-b border-neutral-800 p-2 text-left">{venue.name}</td>
                <td className="border-b border-neutral-800 p-2 text-left">{venue.location}</td>
                <td className="border-b border-neutral-800 p-2 text-left">
                  {venue.sport ? venue.sport.name : "Desconocido"}
                </td>
                <td className="border-b border-neutral-800 p-2 text-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(venue)}
                    className="bg-blue-400 text-neutral-100 rounded-md mr-3 p-1"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteVenue(venue.venue_id)}
                    className="bg-red-400 text-neutral-100 rounded-md p-1"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-600">
                No hay lugares deportivos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SportsVenuesTable;
