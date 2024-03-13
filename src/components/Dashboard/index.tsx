import { useState } from "react";
import { RegisterVolunteerModal } from "../RegisterVolunteerModal";
import { RegisterAnimalModal } from "../RegisterAnimalModal";
import { RegisterResourceModal } from "../RegisterResourceModal";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaDog } from "react-icons/fa";
import { MdMedicationLiquid } from "react-icons/md";
import "./styles.css";
import { ResourceTable } from "../ResourceTable";
import { AnimalTable } from "../AnimalTable";
import { VolunteerTable } from "../VolunteerTable";

export const Dashboard = () => {
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState("volunteer");

  const handleOpenVolunteerModal = () => {
    setIsVolunteerModalOpen(true);
  };
  const handleOpenAnimalModal = () => {
    setIsAnimalModalOpen(true);
  };
  const handleOpenResourceModal = () => {
    setIsResourceModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsVolunteerModalOpen(false);
    setIsAnimalModalOpen(false);
    setIsResourceModalOpen(false);
  };

  return (
    <>
      <nav className="wrapper navbar border-1px">
        <div className="row">
          <div className="cell">
            <div className="title mg-20px">
              <h1>CASOPRAP - Cadastro SOPRAP</h1>
            </div>
          </div>
        </div>
        <div className={selectedTable === 'volunteer' ? 'row selected' : 'row'}>
          <div className="cell">
            <button onClick={() => setSelectedTable("volunteer")}>
              <IoPersonCircleOutline size={24} className="icon" />
              Voluntario
            </button>
          </div>
        </div>
        <div className={selectedTable === 'animal' ? 'row selected' : 'row'}>
          <div className="cell">
            <button onClick={() => setSelectedTable("animal")}>
              <FaDog size={24} className="icon" />
              Animal
            </button>
          </div>
        </div>
        <div className={selectedTable === 'resource' ? 'row selected' : 'row'}>
          <div className="cell">
            <button onClick={() => setSelectedTable("resource")}>
              <MdMedicationLiquid size={24} className="icon" />
              Recursos
            </button>
          </div>
        </div>
      </nav>

      {selectedTable === "volunteer" ? (
        <VolunteerTable isModalOpen={isVolunteerModalOpen} handleOpenModal={handleOpenVolunteerModal} />
      ) : selectedTable === "animal" ? (
        <AnimalTable isModalOpen={isAnimalModalOpen} handleOpenModal={handleOpenAnimalModal} />
      ) : selectedTable === "resource" ? (
        <ResourceTable isModalOpen={isResourceModalOpen} handleOpenModal={handleOpenResourceModal} />
      ) : null}

      <RegisterVolunteerModal
        isOpen={isVolunteerModalOpen}
        onRequestClose={handleCloseModal}
      />
      
      <RegisterAnimalModal
        isOpen={isAnimalModalOpen}
        onRequestClose={handleCloseModal}
      />
      <RegisterResourceModal
        isOpen={isResourceModalOpen}
        onRequestClose={handleCloseModal}
      />
      
    </>
  );
};
