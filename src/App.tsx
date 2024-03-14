import { useState } from "react";
import "./App.css";
import { VolunteerTable } from "./components/VolunteerTable";
import { RegisterVolunteerModal } from "./components/RegisterVolunteerModal";

function App() {
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsVolunteerModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsVolunteerModalOpen(true);
  };

  return (
    <div className="container">
      <RegisterVolunteerModal
        isOpen={isVolunteerModalOpen}
        onRequestClose={handleCloseModal}
      />
      <VolunteerTable
        isModalOpen={isVolunteerModalOpen}
        handleOpenModal={handleOpenModal}
      />
    </div>
  );
}

export default App;
