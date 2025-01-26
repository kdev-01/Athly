import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "./EventCard";

const EventsAll = () => {
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState({});
  const [categories, setCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal para crear evento
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal para editar evento
  const [relatedWorkshops, setRelatedWorkshops] = useState({}); // Relación entre eventos y congresillos

  useEffect(() => {
    fetchEvents();
    fetchSports();
    fetchCategories();
    fetchWorkshops(); // Cargar congresillos al inicio
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:8000/api/events/")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error al obtener los eventos:", error));
  };

  const fetchSports = () => {
    axios
      .get("http://localhost:8000/api/sports/")
      .then((response) => {
        const sportsMap = {};
        response.data.forEach((sport) => {
          sportsMap[sport.sport_id] = sport.name;
        });
        setSports(sportsMap);
      })
      .catch((error) => console.error("Error al obtener los deportes:", error));
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:8000/api/categories/")
      .then((response) => {
        const categoriesMap = {};
        response.data.forEach((category) => {
          categoriesMap[category.category_id] = category.name;
        });
        setCategories(categoriesMap);
      })
      .catch((error) => console.error("Error al obtener las categorías:", error));
  };

  const fetchWorkshops = () => {
    axios
      .get("http://localhost:8000/api/workshops/")
      .then((response) => {
        const workshopMap = {};
        response.data.forEach((workshop) => {
          workshopMap[workshop.event_id] = workshop;
        });
        setRelatedWorkshops(workshopMap);
      })
      .catch((error) => console.error("Error al obtener los congresillos:", error));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null); // Volver al listado de eventos
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      axios
        .delete(`http://localhost:8000/api/events/${eventId}/`)
        .then(() => {
          alert("Evento eliminado exitosamente.");
          fetchEvents();
          setSelectedEvent(null);
        })
        .catch((error) => {
          alert("Error al eliminar el evento.");
          console.error("Error al eliminar el evento:", error);
        });
    }
  };


  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Eventos Deportivos</h1>
        <button
          onClick={handleOpenModal}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          style={{ width: "150px" }}
        >
          Crear Evento
        </button>
      </div>

      {/* Tarjetas de Eventos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.event_id}
              eventName={event.name}
              startDate={event.start_date}
              endDate={event.end_date}
              sportName={sports[event.sport_id] || "Desconocido"}
              categoryName={categories[event.category_id] || "Desconocida"}
              onClick={() => setSelectedEvent(event)}
            />
          ))
        ) : (
          <p className="text-gray-600">No hay eventos disponibles.</p>
        )}
      </div>

      {/* Modal para Crear Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                X
              </button>
            </div>
            <FormEvent
              onEventCreated={() => {
                fetchEvents();
                handleCloseModal();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAll;
