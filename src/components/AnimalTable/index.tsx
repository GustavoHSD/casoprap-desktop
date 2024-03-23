import { useEffect, useState } from "react";
import { Animal } from "../../types/animal";
import { IoPersonAdd } from "react-icons/io5";
import Table from "react-bootstrap/esm/Table";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { RegisterAnimalModal } from "../RegisterAnimalModal";
import { invoke } from "@tauri-apps/api";
import { Volunteer } from "../../types/volunteer";
import { sendNotification } from "@tauri-apps/api/notification";
import { ActionButton } from "../button";

export const AnimalTable = () => {
  const [animals, setAnimals] = useState<Animal[]>();
  const [show, setShow] = useState(false);

  const [deletedAnimal, setDeletedAnimal] = useState(false);

  const handleOpenModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_animals")
        .then((response) => {
          setAnimals(response as Animal[]);
        })
        .catch((error) => console.error(error));
      invoke("get_all_animals_eager").then((response) => console.log(response));
    };

    fetchData();
  }, [show, deletedAnimal]);

  const handleDeleteAnimal = (id: number) => {
    invoke("delete_animal", { id });
    setDeletedAnimal(!deletedAnimal);
  };

  return (
    <div style={{ width: "90vw", margin: "0 auto" }}>
      <ActionButton
        action={handleOpenModal}
        icon={<IoPersonAdd />}
        title="adicionar"
      />
      <Table
        striped
        bordered
        responsive="xxl"
        hover
        title="Animal table"
        style={{ whiteSpace: "nowrap" }}
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" style={{ maxWidth: "100px" }}>
              Nome
            </th>
            <th scope="col">Raca</th>
            <th scope="col">Tipo</th>
            <th scope="col">Idade</th>
            <th scope="col" style={{ width: "40%" }}>
              Local de resgate
            </th>
            <th scope="col">É adotado</th>
            <th scope="col">É cadastrado</th>
            <th scope="col">Voluntario responsavel</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {animals &&
            animals.map((animal: Animal) => {
              return (
                <tr key={animal.animal_id}>
                  <td scope="row" style={{ padding: 20 }}>
                    {animal.animal_id}
                  </td>
                  <td style={{ maxWidth: "200px", overflowX: "auto" }}>
                    {animal.animal_name}
                  </td>
                  <td>{animal.animal_race}</td>
                  <td>{animal.animal_type === "dog" ? "cachorro" : "gato"}</td>
                  <td>{animal.animal_age}</td>
                  <td>{animal.animal_rescue_location}</td>
                  <td>{animal.animal_is_adopted ? "sim" : "nao"}</td>
                  <td>{animal.animal_is_castrated ? "sim" : "nao"}</td>
                  <td>{animal.animal_responsible_volunteer}</td>
                  <td className="d-flex justify-content-evenly">
                    <ActionButton
                      action={() => handleDeleteAnimal(animal.animal_id)}
                      icon={
                        <MdOutlineDeleteForever
                          className="icon"
                          size={32}
                          color="black"
                        />
                      }
                      title="deletar"
                    />

                    <ActionButton
                      action={() => {}}
                      icon={
                        <MdOutlineEdit
                          className="icon"
                          size={32}
                          color="black"
                        />
                      }
                      title="editar"
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <RegisterAnimalModal show={show} handleClose={handleCloseModal} />
    </div>
  );
};
