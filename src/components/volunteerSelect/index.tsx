import { useEffect, useState } from "react";
import Select from "react-select";
import { Volunteer } from "../../types/volunteer";
import { invoke } from "@tauri-apps/api";

type VolunteerSelectProps = {
  name: string;
  placeholder?: string;
  handleFormChange: (event: {
    target: { name: string; value: string };
  }) => void;
};

type Option = {
  label: string;
  value: number;
};

export const VolunteerSelect = ({
  name,
  placeholder,
  handleFormChange,
}: VolunteerSelectProps) => { 
  const [volunteerOption, setVolunteerOption] = useState<Option[]>([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      invoke("get_all_volunteers").then((response) => {
        const volunteers = response as Volunteer[];
        setVolunteerOption(
          volunteers.map((volunteer) => ({
            label: `${volunteer.id} - Nome: ${volunteer.name}, CPF: ${volunteer.cpf}`,
            value: volunteer.id,
          }))
        );
      });
    };

    fetchVolunteers();
  }, []);

  return (
    <Select
      name={name}
      placeholder={placeholder ?? "Selecione um voluntario"}
      options={volunteerOption}
      onChange={(o) => {
        handleFormChange({
          target: {
            name: name,
            value: o?.value.toString() ?? "",
          },
        });
      }}
    />
  );
};
