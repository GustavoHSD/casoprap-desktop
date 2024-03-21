import { useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import "./styles.css";
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { invoke } from "@tauri-apps/api";
import { Button, Table } from "react-bootstrap";
import { RegisterVolunteerModal } from "../RegisterVolunteerModal";
import { IoPersonAdd } from "react-icons/io5";
import { ActionButton } from "../button";

export const VolunteerTable = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>();
  const [deletedVolunteer, setDeletedVolunteer] = useState(false);
  const [show, setShow] = useState(false);

  const handleOpenModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    const fetchData = () => {
      invoke("get_all_volunteers")
        .then((response) => {
          setVolunteers(response as Volunteer[]);
        })
        .catch((error) => console.error(error));
    };

    fetchData();
  }, [show, deletedVolunteer]);

  const handleDeleteVolunteer = (id: number) => {
    invoke("delete_volunteer", { id });
    setDeletedVolunteer(!deletedVolunteer);
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
        title="Volunteer table"
        style={{ whiteSpace: "nowrap" }}
      >
        <thead>
          <tr>
            <th scope="col" style={{ padding: 0 }}>
              #
            </th>
            <th scope="col" style={{ width: "45%" }}>
              Nome
            </th>
            <th scope="col" style={{ width: "30%" }}>
              Cpf
            </th>
            <th scope="col">Esta ativo</th>
            <th scope="col" style={{ width: "15%" }}>
              Acoes
            </th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {volunteers &&
            volunteers.map((volunteer: Volunteer) => (
              <tr key={volunteer.id}>
                <td scope="row" style={{ padding: 20, margin: 0 }}>
                  {volunteer.id}
                </td>
                <td>{volunteer.name}</td>
                <td>{volunteer.cpf}</td>
                <td>{volunteer.is_active ? "Sim" : "Nao"}</td>
                <td className="d-flex justify-content-evenly">
                  <ActionButton
                    action={() => handleDeleteVolunteer(volunteer.id)}
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
                      <MdOutlineEdit className="icon" size={32} color="black" />
                    }
                    title="editar"
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <RegisterVolunteerModal show={show} handleClose={handleCloseModal} />
    </div>
  );
};
