import { useEffect, useState } from "react";
import { Animal } from "../../types/animal";
import "./styles.css";
import { IoPersonAddSharp } from "react-icons/io5";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";
import { sendNotification } from "@tauri-apps/api/notification";

type AnimalTableProps = {
  isModalOpen: boolean;
  handleOpenModal: () => void;
};

export const AnimalTable = ({
  isModalOpen,
  handleOpenModal,
}: AnimalTableProps) => {
  const [animals, setAnimals] = useState<any>();
  const [adopted, setAdopted] = useState(false);
  const [volunteers, setVolunteers] = useState<any>();

  /*
    api::volunteer::create_volunteer,
    api::volunteer::find_all_volunteers,
    api::volunteer::find_volunteer_by_id,
    api::animal::create_animal,
    api::animal::find_all_animals,
    api::animal::find_animal_by_id,
    api::animal::find_animal_by_volunteer,
    api::animal::set_as_adopted,
    api::animal::set_as_not_adopted,
    api::resource::create_resource,
    api::resource::find_all_resources,
    api::resource::find_resource_by_id,
    api::resource::find_resource_by_volunteer,
*/
  const setAsAdopted = async (id: number) => {
    invoke("set_as_adopted", { id });
    setAdopted(!adopted);
  };

  const setAsNotAdopted = async (id: number) => {
    invoke("set_as_not_adopted", { id });
    setAdopted(!adopted);
  };

  useEffect(() => {
    const fetchData = async () => {
      invoke("find_all_animals")
        .then((response) => setAnimals(response))
        .catch((error) => sendNotification(error));

      const volunteerIds = animals.map(
        (animal: Animal) => animal.responsible_volunteer
      );

      const volunteerResponses = await Promise.all(
        volunteerIds.map((id: number) => invoke("find_volunteer_by_id", { id }))
      );

      const volunteerData = volunteerResponses.map((response) => response as Volunteer);

      setVolunteers(volunteerData);
    };
    fetchData();
  }, [isModalOpen, adopted]);

  return (
    <div className="wrapper table-wrapper max-width">
      <div className="row">
        <div className="cell">
          <div className="title title-margin">
            <h1>Tabela de Animais</h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="cell button-margin">
          <button onClick={handleOpenModal} className="button">
            <IoPersonAddSharp size={32} />
          </button>
        </div>
        <div className="cell">
          <table className="table">
            <thead>
              <tr>
                <th>nome</th>
                <th>raça</th>
                <th>tipo</th>
                <th>idade</th>
                <th>local de resgate</th>
                <th>é castrado</th>
                <th>é adotado</th>
                <th>nome do voluntario</th>
                <th>açoes</th>
              </tr>
            </thead>
            <tbody>
              {/*animals.map((animal: Animal) => {
                const associatedVolunteer = volunteers.find(
                  (volunteer: Volunteer) =>
                    volunteer.id === animal.responsible_volunteer
                );
                return (
                  <tr key={animal.id}>
                    <td>{animal.name}</td>
                    <td>{animal.race}</td>
                    <td>{animal.a_type === "cat" ? "Gato" : "Cachorro"}</td>
                    <td>{animal.age}</td>
                    <td>{animal.rescue_location}</td>
                    <td>{animal.is_castrated ? "Sim" : "Nao"}</td>
                    <td>{animal.is_adopted ? "Sim" : "Nao"}</td>
                    <td>{associatedVolunteer?.name}</td>
                    <td>
                      {animal.is_adopted ? (
                        <button
                          onClick={() => setAsNotAdopted(animal.id)}
                          className="action-button"
                        >
                          Marcar como nao adotado
                        </button>
                      ) : (
                        <button
                          onClick={() => setAsAdopted(animal.id)}
                          className="action-button"
                        >
                          Marcar como adotado
                        </button>
                      )}
                    </td>
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
