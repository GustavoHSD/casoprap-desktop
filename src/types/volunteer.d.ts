export type Volunteer = {
  id: number;
  name: string;
  cpf: string;
  is_active: boolean;
};

export type VolunteerRequest = Omit<Volunteer, 'id'>; 

