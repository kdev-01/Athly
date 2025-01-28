import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-gray-200 w-64 space-y-6 py-7 px-2">
      <h1 className="text-2xl font-bold text-center">Athly</h1>
      <nav>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Inicio
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Eventos
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Categorías
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Deportistas
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Configuración
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
