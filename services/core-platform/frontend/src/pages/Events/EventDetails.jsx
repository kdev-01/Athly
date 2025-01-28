import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "../../components/Events/Calendar";

const EventDetails = ({ event }) => {
  const [workshop, setWorkshop] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    // Cargar workshops y buscar el relacionado al evento
    axios
      .get("http://localhost:8000/api/workshops")
      .then((response) => {
        const relatedWorkshop = response.data.find(
          (ws) => ws.event_id === event.event_id
        );
        setWorkshop(relatedWorkshop);
      })
      .catch((error) =>
        console.error("Error al cargar los congresillos técnicos:", error)
      );

    // Cargar instituciones educativas relacionadas al evento
    axios
      .get("http://localhost:8000/api/event_participants")
      .then((participantsResponse) => {
        const participantInstitutions = participantsResponse.data
          .filter((participant) => participant.id_event === event.event_id)
          .map((participant) => participant.id_educational_institution);

        axios
          .get("http://localhost:8000/api/institutions")
          .then((institutionsResponse) => {
            const relatedInstitutions = institutionsResponse.data.filter(
              (institution) =>
                participantInstitutions.includes(institution.institution_id)
            );
            setInstitutions(relatedInstitutions);
          })
          .catch((error) =>
            console.error("Error al cargar las instituciones:", error)
          );
      })
      .catch((error) =>
        console.error("Error al cargar los participantes del evento:", error)
      );

    // Cargar escenarios deportivos relacionados al evento
    axios
      .get("http://localhost:8000/api/venue_event")
      .then((venuesResponse) => {
        const relatedVenues = venuesResponse.data
          .filter((venueEvent) => venueEvent.id_event === event.event_id)
          .map((venueEvent) => venueEvent.id_venue);

        axios
          .get("http://localhost:8000/api/sports_venues")
          .then((venuesData) => {
            const venuesList = venuesData.data.filter((venue) =>
              relatedVenues.includes(venue.venue_id)
            );
            setVenues(venuesList);
          })
          .catch((error) =>
            console.error("Error al cargar los escenarios deportivos:", error)
          );
      })
      .catch((error) =>
        console.error("Error al cargar la relación de escenarios:", error)
      );
  }, [event.event_id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Título principal */}
      <div className="bg-black text-white text-center font-bold py-3 rounded-t-lg">
        DETALLES DEL EVENTO
      </div>

      {/* Información principal del evento */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Fecha de Inicio:</strong> {event.start_date}
            </p>
            <p>
              <strong>Fecha Fin:</strong> {event.end_date}
            </p>
            <p>
              <strong>Fecha Inicio Inscripciones:</strong>{" "}
              {event.registration_start_date || "Desconocido"}
            </p>
            <p>
              <strong>Fecha Fin de Inscripciones:</strong>{" "}
              {event.registration_end_date || "Desconocido"}
            </p>
          </div>
          <div>
            <p>
              <strong>Deporte:</strong> {event.sport?.name || "Desconocido"}
            </p>
            <p>
              <strong>Categoría:</strong> {event.category?.name || "Desconocida"}
            </p>
          </div>
        </div>
      </div>

      {/* Congresillo Técnico */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-4">CONGRESILLO TÉCNICO</h2>
        {workshop ? (
          <div className="border-t pt-4">
            <p>
              <strong>Nombre:</strong> {workshop.name}
            </p>
            <p>
              <strong>Fecha:</strong> {workshop.date_time || "No especificada"}
            </p>
            <p>
              <strong>Ubicación:</strong> {workshop.location || "No especificada"}
            </p>
            <p>
              <strong>Descripción:</strong>{" "}
              {workshop.description || "No especificada"}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">
            No hay información del congresillo técnico.
          </p>
        )}
      </div>

      {/* Instituciones Educativas Participantes */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-4">
          INSTITUCIONES EDUCATIVAS PARTICIPANTES
        </h2>
        {institutions.length > 0 ? (
          <ul>
            {institutions.map((institution) => (
              <li key={institution.institution_id} className="mb-2">
                <p>{institution.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            No hay instituciones educativas participantes en este evento.
          </p>
        )}
      </div>

      {/* Escenarios Deportivos */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-4">ESCENARIOS DEPORTIVOS</h2>
        {venues.length > 0 ? (
          <ul>
            {venues.map((venue) => (
              <li key={venue.venue_id} className="mb-2">
                <p>
                  <strong>Nombre:</strong> {venue.name}
                </p>
                <p>
                  <strong>Ubicación:</strong> {venue.location}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            No hay escenarios deportivos asignados a este evento.
          </p>
        )}
      </div>

      {/* Calendario de Encuentros */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-4">CALENDARIO DE ENCUENTROS</h2>
        <div
          className="bg-white border border-gray-300 rounded-lg overflow-y-auto p-4"
          style={{ maxHeight: "800px", minHeight: "200px" }} // 📌 Ajuste de tamaño
        >
          <Calendar
            teams={institutions.map((institution) => institution.name)}
            scenarios={venues}
            startDate={event.start_date}
          />
        </div>
      </div>

      {/* Resultados de Encuentros */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-4">RESULTADOS DE ENCUENTROS</h2>
        <div className="bg-white border border-gray-300 rounded-lg overflow-y-auto p-4">

        </div>
      </div>

    </div>
  );
};

export default EventDetails;
