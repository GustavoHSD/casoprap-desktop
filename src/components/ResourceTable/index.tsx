import { useEffect, useState } from "react";
import { Resource } from "../../types/resource";
import "./styles.css";
import { IoPersonAdd, IoPersonAddSharp } from "react-icons/io5";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";
import { ActionButton } from "../button";
import Table from "react-bootstrap/esm/Table";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { MdOutlineDeleteForever, MdOutlineEdit } from "react-icons/md";
import { RegisterResourceModal } from "../RegisterResourceModal";

type Row = {
  volunteer: Volunteer;
  resource: Resource;
};

export const AnimalTable = () => {
  const [rows, setRows] = useState<Row[]>();
  const [show, setShow] = useState(false);

  const [deletedAnimal, setDeletedAnimal] = useState(false);

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
            <th scope="col" style={{ width: "40%" }}>
                Descricao 
            </th>
            <th scope="col">Preco</th>
            <th scope="col">Voluntario Associado</th>
            <th scope="col">Acoes</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {rows &&
            rows.map((row: Row) => {
              return (
                <tr key={row.resource.id}>
                  <td scope="row" style={{ padding: 20 }}>
                    {row.resource.id}
                  </td>
                  <td>{row.resource.description}</td>
                  <td>{row.resource.price}</td> 
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
      <RegisterResourceModal show={show} handleClose={handleCloseModal} />
    </div>
  )
};;
