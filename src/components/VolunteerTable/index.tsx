import { useEffect, useState } from "react";
import { Volunteer } from "../../types/volunteer";
import "./styles.css";
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { invoke } from "@tauri-apps/api";
import { Button, Table } from "react-bootstrap";
import { RegisterVolunteerModal } from "../RegisterVolunteerModal";
import { IoPersonAdd } from "react-icons/io5";

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
    <div style={{ width: '80vw', margin: '0 auto' }}>
      <Button variant="dark" onClick={handleOpenModal}>
        <IoPersonAdd />
      </Button>
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
            <th scope="col">Nome</th>
            <th scope="col">Cpf</th>
            <th scope="col">Esta ativo</th>
            <th scope="col" style={{ width: "15vw"}}>Acoes</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {volunteers &&
            volunteers.map((volunteer: Volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.name}</td>
                <td>{volunteer.cpf}</td>
                <td>{volunteer.is_active ? "Sim" : "Nao"}</td>
                <td className="d-flex justify-content-evenly">
                  <Button
                    onClick={() => handleDeleteVolunteer(volunteer.id)}
                    variant="outline-secondary p-2 m-1"
                    title="deletar"
                  >
                    <MdOutlineDeleteForever size={32}  color="black"/>
                  </Button>
                  <Button
                    onClick={() => {}}
                    variant="outline-secondary p-2 m-1"
                    title="editar" 
                  >
                    <MdOutlineEdit size={32} color="black"/>
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <RegisterVolunteerModal show={show} handleClose={handleCloseModal} />
    </div>
  );
};
