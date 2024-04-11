import { useEffect, useState } from "react";
import { Animal } from "../../types/animal";
import Table from "react-bootstrap/esm/Table";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { RegisterAnimalModal } from "../AnimalModal";
import { invoke } from "@tauri-apps/api";
import { ActionButton } from "../button";
import { Volunteer } from "../../types/volunteer";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { sendNotification } from "@tauri-apps/api/notification";
import { IoIosAddCircle } from "react-icons/io";

type Row = {
  volunteer: Volunteer;
  animal: Animal;
};

export const AnimalTable = () => {
  const [animals, setAnimals] = useState<Row[]>();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [tableHasChanged, setTableHasChanged] = useState(false);
  const [filterAdopted, setFilterAdopted] = useState(false);
  const [filterCastrated, setFilterCastrated] = useState(false);

  const handleOpenModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  const handleSetAdopted = (animal: Animal) => {
    animal.is_adopted = !animal.is_adopted;
    invoke("update_animal", { id: animal.id, animalReq: animal })
      .then(() => setTableHasChanged(!tableHasChanged))
      .catch((error) => sendNotification(error));
  };

  const handleSetCastrado = (animal: Animal) => {
    animal.is_castrado = !animal.is_castrado;
    invoke("update_animal", { id: animal.id, animalReq: animal })
      .then(() => setTableHasChanged(!tableHasChanged))
      .catch((error) => sendNotification(error));
  };

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_animals_eager")
        .then((response) => {
          setAnimals(response as Row[]);
        })
        .catch((error) => sendNotification(error));
    };

    fetchData();
  }, [show, tableHasChanged]);

  const handleDeleteAnimal = (id: number) => {
    invoke("delete_animal", { id });
    setTableHasChanged(!tableHasChanged);
  };

  const handleFilterAdopted = () => {
    setFilterAdopted(!filterAdopted);
  };

  const handleFilterCastrated = () => {
    setFilterCastrated(!filterCastrated);
  };

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between">
        <ActionButton
          action={handleOpenModal}
          icon={<IoIosAddCircle size={24} />}
          title="adicionar"
        />
        <Form.Group className="align-self-center w-25">
          <Form.Control
            className="align-self-center"
            type="search"
            placeholder="Digite o nome do animal ou responsavel"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>
      </div>
      <div className="table-wrapper">
        <Table striped hover>
          <thead>
            <tr>
              <th>#</th>
              <th style={{ width: "30%" }}>Nome</th>
              <th>Raca</th>
              <th style={{ width: "15%"}}>Tipo</th>
              <th>Idade</th>
              <th style={{ width: "40%" }}>Local de resgate</th>
              <th>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {filterAdopted
                        ? "Clique para ver todos animais"
                        : "Clique para ver animais NAO adotados"}
                    </Tooltip>
                  }
                >
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleFilterAdopted()}
                  >
                    É adotado
                  </div>
                </OverlayTrigger>
              </th>
              <th>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {filterCastrated
                        ? "Clique para ver todos animais"
                        : "Clique para ver animais NAO castrados"}
                    </Tooltip>
                  }
                >
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleFilterCastrated()}
                  >
                    É castrado
                  </div>
                </OverlayTrigger>
              </th>
              <th>Voluntario responsavel</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {animals &&
              animals
                .filter((row: Row) => {
                  return (
                    (row.animal.name.toLowerCase().includes(search) ||
                      row.volunteer.name.toLowerCase().includes(search)) &&
                    (filterAdopted ? row.animal.is_adopted === false : true) &&
                    (filterCastrated ? row.animal.is_castrado === false : true)
                  );
                })
                .map((row: Row) => {
                  return (
                    <tr key={row.animal.id}>
                      <td scope="row">{row.animal.id}</td>
                      <td>{row.animal.name}</td>
                      <td>{row.animal.race}</td>
                      <td>
                        {row.animal.animal_type === "cat"
                          ? "gato"
                          : row.animal.animal_type === "dog"
                            ? "cachorro"
                            : "algo de errado aconteceu"}
                      </td>
                      <td>{row.animal.age}</td>
                      <td>{row.animal.rescue_location}</td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {row.animal.is_adopted
                                ? "Clique para marcar este animal como adotado"
                                : "Clique para marcar este animal como NAO adotado"}
                            </Tooltip>
                          }
                        >
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSetAdopted(row.animal)}
                          >
                            {row.animal.is_adopted ? "sim" : "nao"}
                          </div>
                        </OverlayTrigger>
                      </td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {row.animal.is_castrado
                                ? "Clique para marcar este animal como castrado"
                                : "Clique para marcar este animal como NAO castrado"}
                            </Tooltip>
                          }
                        >
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSetCastrado(row.animal)}
                          >
                            {row.animal.is_castrado ? "sim" : "nao"}
                          </div>
                        </OverlayTrigger>
                      </td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              Nome: {row.volunteer.name}, Cpf:{" "}
                              {row.volunteer.cpf}
                            </Tooltip>
                          }
                        >
                          <div>{row.volunteer.name}</div>
                        </OverlayTrigger>
                      </td>
                      <td>
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
      </div>
      <RegisterAnimalModal show={show} handleClose={handleCloseModal} />
    </div>
  );
};
