import React, { useEffect, useState } from "react";
import axios from "axios";

const HomeEventCards = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Llamada al API para obtener los eventos
    axios
      .get("http://localhost:8000/api/events/")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los eventos:", error);
      });
  }, []);

  const handleNext = () => {
    if (currentIndex < Math.ceil(filteredEvents.length / 3) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleEvents = filteredEvents.slice(
    currentIndex * 3,
    currentIndex * 3 + 3
  );

  return (
    <div className="relative">
      {/* Filtro de búsqueda */}
      <div className="mb-6 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Buscar por nombre del torneo..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Botón para desplazar hacia la izquierda */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-800 disabled:opacity-50"
        disabled={currentIndex === 0}
      >
        &#10094;
      </button>

      {/* Contenedor de las tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-4xl">
        {visibleEvents.length > 0 ? (
          visibleEvents.map((event) => (
            <div
              key={event.event_id}
              className="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Deporte:</strong> {event.sport?.name || "Desconocido"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Categoría:</strong>{" "}
                  {event.category?.name || "Desconocida"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Fecha de Inicio:</strong> {event.start_date}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Fecha de Fin:</strong> {event.end_date}
                </p>
              </div>
              <div className="mt-4">
                <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
                  Ver detalles
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No se encontraron eventos.
          </p>
        )}
      </div>

      {/* Botón para desplazar hacia la derecha */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-800 disabled:opacity-50"
        disabled={currentIndex === Math.ceil(filteredEvents.length / 3) - 1}
      >
        &#10095;
      </button>
    </div>
  );
};

export default HomeEventCards;
