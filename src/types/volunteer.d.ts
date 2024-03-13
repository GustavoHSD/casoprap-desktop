export type Volunteer = {
  id: number;
  name: String;
  cpf: String;
  is_active: boolean;
};

export type VolunteerReq = Omit<Volunteer, 'id'>; 
