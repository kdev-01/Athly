import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Calendar = ({ teams, scenarios, startDate }) => {
  if (teams.length < 2 || scenarios.length === 0) {
    return <p>No hay suficientes equipos o escenarios para generar un calendario.</p>;
  }

  const calendarRef = useRef(null);
  const [selectedJudges, setSelectedJudges] = useState({});

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let yOffset = 10;
    const elements = document.querySelectorAll(".calendar-section");

    // Ocultar select y mostrar los nombres de los jueces como texto antes de capturar
    document.querySelectorAll(".judge-select").forEach(select => {
      select.style.display = "none";
    });
    document.querySelectorAll(".judge-text").forEach(span => {
      span.style.display = "inline";
    });

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yOffset + imgHeight > 280) {
        pdf.addPage();
        yOffset = 10;
      }

      pdf.addImage(imgData, "PNG", 10, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 10;
    }

    pdf.save("Calendario.pdf");

    // 2 Restaurar select después de la captura
    document.querySelectorAll(".judge-select").forEach(select => {
      select.style.display = "inline";
    });
    document.querySelectorAll(".judge-text").forEach(span => {
      span.style.display = "none";
    });
  };

  const judges = ["Carlos Pérez", "María Gómez", "José Ramírez", "Ana Torres", "Luis Fernández"];

  const matchesByRound = [];
  const totalRounds = teams.length - 1;
  const scenariosCount = scenarios.length;
  let currentStartDate = new Date(startDate);

  for (let round = 0; round < totalRounds; round++) {
    let usedTeams = new Set();
    let roundMatches = [];

    for (let i = 0; i < teams.length / 2; i++) {
      const team1 = teams[i];
      const team2 = teams[teams.length - 1 - i];

      if (!usedTeams.has(team1) && !usedTeams.has(team2)) {
        roundMatches.push({ team1, team2 });
        usedTeams.add(team1);
        usedTeams.add(team2);
      }
    }

    teams.splice(1, 0, teams.pop());

    let matches = [];
    let matchTime = new Date(`${currentStartDate.toISOString().split("T")[0]}T07:30:00`);

    for (let j = 0; j < roundMatches.length; j++) {
      const scenario = scenarios[j % scenariosCount];
      const assignedJudge = judges[j % judges.length];

      matches.push({
        ...roundMatches[j],
        scenario: scenario.name,
        location: scenario.location,
        time: new Date(matchTime),
        judge: assignedJudge
      });

      matchTime.setHours(matchTime.getHours() + 1);
      if (matchTime.getHours() >= 12) break;
    }

    matchesByRound.push({
      round: round + 1,
      matches,
      date: currentStartDate.toISOString().split("T")[0],
    });

    currentStartDate.setDate(currentStartDate.getDate() + 1);
  }

  

  const topTeams = ["Equipo A", "Equipo B", "Equipo C", "Equipo D"];

  return (
    <div className="relative p-4">
      <button
        onClick={handleDownloadPDF}
        className="absolute top-2 right-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Descargar PDF
      </button>

      <div ref={calendarRef}>
        {matchesByRound.map((roundData) => (
          <div key={roundData.round} className="calendar-section mb-6 bg-gray-200 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              Ronda {roundData.round} - {roundData.date}
            </h2>
            {roundData.matches.map((match, index) => (
              <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow">
                <p><strong>Hora:</strong> {match.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                <p><strong>Equipo 1:</strong> {match.team1}</p>
                <p><strong>Equipo 2:</strong> {match.team2}</p>
                <p><strong>Escenario:</strong> {match.scenario}</p>
                <p><strong>Ubicación:</strong> {match.location}</p>
                <p>
                  <strong>Juez Asignado:</strong>{" "}
                  <span className="judge-text hidden">{match.judge}</span>
                  <select
                    className="judge-select border border-gray-300 rounded p-1 ml-2"
                    value={selectedJudges[index] || match.judge}
                    onChange={(e) => setSelectedJudges({ ...selectedJudges, [index]: e.target.value })}
                  >
                    {judges.map((judge, idx) => (
                      <option key={idx} value={judge}>{judge}</option>
                    ))}
                  </select>
                </p>
              </div>
            ))}
          </div>
        ))}

        {/* Bracket de Semifinales y Final */}
        <div className="mt-12 p-4 bg-gray-300 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center mb-6">🏆 Fase Eliminatoria</h2>

          <div className="flex flex-col items-center">
            {/* Semifinales */}
            <div className="flex justify-center space-x-16 mb-10">
              <div className="bg-white shadow-md p-6 rounded-lg text-center w-48">
                <p className="font-bold">Semifinal 1</p>
                <p>{topTeams[0]} vs {topTeams[3]}</p>
              </div>
              <div className="bg-white shadow-md p-6 rounded-lg text-center w-48">
                <p className="font-bold">Semifinal 2</p>
                <p>{topTeams[1]} vs {topTeams[2]}</p>
              </div>
            </div>

            {/* Final */}
            <div className="bg-white shadow-md p-6 rounded-lg text-center w-48">
              <p className="font-bold">🏆 Final</p>
              <p>Ganador SF1 vs Ganador SF2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
