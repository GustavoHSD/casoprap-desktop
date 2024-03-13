import { useEffect, useState } from "react";
import { Resource } from "../../types/resource";
import "./styles.css";
import { IoPersonAddSharp } from "react-icons/io5";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";

type ResourceTableProps = {
  isModalOpen: boolean;
  handleOpenModal: () => void;
};
export const ResourceTable = ({
  isModalOpen,
  handleOpenModal,
}: ResourceTableProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      invoke("find_all_resources")
        .then((response) => setResources(response as Resource[]))
        .catch((error) => console.error(error));

      const volunteerIds = resources.map(
        (resource: Resource) => resource.volunteer_id
      );

      const volunteerResponses = await Promise.all(
        volunteerIds.map((id: number) => invoke("find_volunteer_by_id", { id }))
      );

      const volunteerData = volunteerResponses.map((response) => response as Volunteer);
      setVolunteers(volunteerData);
    };
    fetchData();
  }, [isModalOpen]);

  return (
    <div className="wrapper table-wrapper max-width">
      <div className="row">
        <div className="cell">
          <div className="title title-margin">
            <h1>Tabela de Recursos</h1>
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
                <th>Descricao</th>
                <th>Preco</th>
                <th>Nome do voluntario associado</th>
                <th>Cpf do voluntario associado</th>
              </tr>
            </thead>
            <tbody>
              {/*resources.map((resource: Resource) => {
                const associatedVolunteer = volunteers.find(
                  (volunteer: Volunteer) =>
                    volunteer.id === resource.volunteer_id
                );
                return (
                  <tr key={resource.id}>
                    <td>{resource.description}</td>
                    <td>{resource.price}</td>
                    <td>{associatedVolunteer?.name}</td>
                    <td>{associatedVolunteer?.cpf}</td>
                  </tr>
                );
              })*/}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
