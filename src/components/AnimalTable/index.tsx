import { useEffect, useState } from "react";
import { Animal } from "../../types/animal";
import "./styles.css";
import { IoPersonAdd } from "react-icons/io5";
import Button from "react-bootstrap/esm/Button";
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
    };

    fetchData();
  }, [show, deletedAnimal]);

  const handleDeleteAnimal = (id: number) => {
    invoke("delete_animal", { id });
    setDeletedAnimal(!deletedAnimal);
  };

  const getResponsibleVolunteer = (id: number): Promise<Volunteer> => {
    const volunteer = invoke("get_volunteer", { id })
      .then((response) => {
        return response as Volunteer;
      })
      .catch((error) => {
        sendNotification(error);
        console.error(error);
        throw error;
      });
    return volunteer;
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
            <th scope="col" style={{ width: "40%" }}>
              Nome
            </th>
            <th scope="col">Raca</th>
            <th scope="col">Tipo</th>
            <th scope="col">Idade</th>
            <th scope="col" style={{ width: "40%" }}>
              Local de resgate
            </th>
            <th scope="col">E adotado</th>
            <th scope="col">E cadastrado</th>
            <th scope="col">Voluntario responsavel</th>
            <th scope="col">Acoes</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {animals &&
            animals.map((animal: Animal) => {
              return (
                <tr key={animal.id}>
                  <td scope="row" style={{ padding: 20 }}>
                    {animal.id}
                  </td>
                  <td style={{ overflowX: "auto" }}>{animal.name}</td>
                  <td>{animal.race}</td>
                  <td>{animal.a_type}</td>
                  <td>{animal.age}</td>
                  <td>{animal.rescue_location}</td>
                  <td>{animal.is_adopted ? "sim" : "nao"}</td>
                  <td>{animal.is_castrated ? "sim" : "nao"}</td>
                  <td>{animal.responsible_volunteer}</td>
                  <td className="d-flex justify-content-evenly">
                    <ActionButton
                      action={() => handleDeleteAnimal(animal.id)}
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
