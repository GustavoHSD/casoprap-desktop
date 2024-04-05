import { useEffect, useState } from "react";
import { Resource } from "../../types/resource";
import { IoPersonAdd } from "react-icons/io5";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";
import { ActionButton } from "../button";
import Table from "react-bootstrap/esm/Table";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { RegisterResourceModal } from "../ResourceModal";
import Form from "react-bootstrap/esm/Form";

type Row = {
  volunteer: Volunteer;
  resource: Resource;
};

export const ResourceTable = () => {
  const [rows, setRows] = useState<Row[]>();
  const [show, setShow] = useState(false);
  const [tableHasChanged, setTableHasChanged] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpenModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_resources_eager")
        .then((response) => {
          setRows(response as Row[]);
        })
        .catch((error) => console.error(error));
    };

    fetchData();
  }, [show, tableHasChanged]);

  const handleDeleteAnimal = (id: number) => {
    invoke("delete_resource", { id });
    setTableHasChanged(!tableHasChanged);
  };

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between">
        <ActionButton
          action={handleOpenModal}
          icon={<IoPersonAdd />}
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
              <th style={{ width: "50%" }}>Descricao</th>
              <th style={{ width: "30%" }}>Preco</th>
              <th>Voluntario Associado</th>
              <th style={{ width: "10%" }}>Acoes</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {rows &&
              rows
                .filter((row: Row) => {
                  return (
                    row.resource.description.toLowerCase().includes(search) ||
                    row.volunteer.cpf.toLowerCase().includes(search) ||
                    row.volunteer.name.toLowerCase().includes(search)
                  );
                })
                .map((row: Row) => {
                  return (
                    <tr key={row.resource.id}>
                      <td scope="row">{row.resource.id}</td>
                      <td>{row.resource.description}</td>
                      <td>{row.resource.price}</td>
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
                          action={() => handleDeleteAnimal(row.resource.id)}
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
      <RegisterResourceModal show={show} handleClose={handleCloseModal} />
    </div>
  );
};
