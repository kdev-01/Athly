import React from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import AllEvents from "../components/Events/EventsAll";
import EventCard from "../components/Events/EventCard"
import FormEvent from "../components/Events/FormEvent";
import SportVenue from "../components/Sports_Venues/FormSportsVenue"

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6" >
          <div>
            {/* All Events */}
            <AllEvents />
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
