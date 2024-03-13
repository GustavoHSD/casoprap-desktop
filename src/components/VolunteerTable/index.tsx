import { useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import "./styles.css";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { invoke } from "@tauri-apps/api";

type VolunteerTableProps = {
  isModalOpen: boolean;
  handleOpenModal: () => void;
};
export const VolunteerTable = ({
  isModalOpen,
  handleOpenModal,
}: VolunteerTableProps) => {
  const [volunteers, setVolunteers] = useState<any>();
  const [deletedVolunteer, setDeletedVolunteer] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("find_all_volunteers")
        .then((response) => {
          setVolunteers(response);
        })
        .catch((error) => console.error(error));
    };

    console.log(volunteers);

    fetchData();
  }, [isModalOpen, deletedVolunteer]);

  const handleDeleteVolunteer = (id: number) => {
    invoke("delete_volunteer", { id });
    setDeletedVolunteer(!deletedVolunteer);
  };

  return (
    <div className="wrapper table-wrapper max-width">
      <div className="row">
        <div className="cell">
          <div className="title title-margin">
            <h1>Tabela de Voluntarios</h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="cell">
          <button onClick={handleOpenModal} className="button button-margin">
            <IoPersonAddSharp size={32} />
          </button>
        </div>
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
              {/*volunteers.map((volunteer: Volunteer) => (
                <tr key={volunteer.id}>
                  <td>{volunteer.name}</td>
                  <td>{volunteer.cpf}</td>
                  <td>{volunteer.is_active ? "Sim" : "Nao"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteVolunteer(volunteer.id)}
                      className="button button-margin"
                    >
                      <MdOutlineDeleteForever size={32} />
                    </button>
                  </td>
                </tr>
              ))*/}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
