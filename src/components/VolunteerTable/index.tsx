import { useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import "./styles.css";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { invoke } from "@tauri-apps/api";

type VolunteerTableProps = {
  isModalOpen: boolean;
  handleOpenModal: () => void;
};
export const VolunteerTable = ({
  isModalOpen,
  handleOpenModal,
}: VolunteerTableProps) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>();
  const [deletedVolunteer, setDeletedVolunteer] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_volunteers")
        .then((response) => {
          setVolunteers(response as Volunteer[]);
        })
        .catch((error) => console.error(error));
    };

    fetchData();
  }, [isModalOpen, deletedVolunteer]);

  const handleDeleteVolunteer = (id: number) => {
    invoke("delete_volunteer", { id });
    setDeletedVolunteer(!deletedVolunteer);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="cell">
          <h1>Tabela de Voluntarios</h1>
        </div>
      </div>
      <div className="row">
        <div className="cell">
          <button onClick={handleOpenModal}>
            <IoPersonAddSharp size={32} />
          </button>
        </div>
      </div>
      <div className="row">
        <div className="cell">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cpf</th>
                <th>Esta ativo</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {volunteers &&
                volunteers.map((volunteer: Volunteer) => (
                  <tr key={volunteer.id}>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.cpf}</td>
                    <td>{volunteer.is_active ? "Sim" : "Nao"}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteVolunteer(volunteer.id)}
                        className="action-button"
                      >
                        <MdOutlineDeleteForever size={32} />
                      </button>
                      <button
                        onClick={() => handleDeleteVolunteer(volunteer.id)}
                        className="action-button"
                      >
                        <MdOutlineEdit size={32} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
