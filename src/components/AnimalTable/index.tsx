import { useEffect, useState } from "react";
import { Animal } from "../../types/animal";
import { IoPersonAdd } from "react-icons/io5";
import Table from "react-bootstrap/esm/Table";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { RegisterAnimalModal } from "../RegisterAnimalModal";
import { invoke } from "@tauri-apps/api";
import { ActionButton } from "../button";
import { Volunteer } from "../../types/volunteer";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type Row = {
  volunteer: Volunteer;
  animal: Animal;
};

export const AnimalTable = () => {
  const [animals, setAnimals] = useState<Row[]>();
  const [show, setShow] = useState(false);

  const [deletedAnimal, setDeletedAnimal] = useState(false);

  const handleOpenModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_animals_eager")
        .then((response) => {
          console.log(response);
          setAnimals(response as Row[]);
        })
        .catch((error) => console.error(error));
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
            animals.map((row: Row) => {
              return (
                <tr key={row.animal.id}>
                  <td scope="row" style={{ padding: 20 }}>
                    {row.animal.id}
                  </td>
                  <td style={{ overflowX: "auto" }}>{row.animal.name}</td>
                  <td>{row.animal.race}</td>
                  <td>{row.animal.animal_type}</td>
                  <td>{row.animal.age}</td>
                  <td>{row.animal.rescue_location}</td>
                  <td>{row.animal.is_adopted ? "sim" : "nao"}</td>
                  <td>{row.animal.is_castrado ? "sim" : "nao"}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          Nome: {row.volunteer.name}, Cpf: {row.volunteer.cpf}
                        </Tooltip>
                      }
                    >
                      <div>{row.volunteer.name}</div>
                    </OverlayTrigger>
                  </td>
                  <td className="d-flex justify-content-evenly">
                    <ActionButton
                      action={() => handleDeleteAnimal(row.animal.id)}
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
