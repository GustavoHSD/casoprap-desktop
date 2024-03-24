export type Volunteer = {
  volunteer_id: number;
  volunteer_name: string;
  volunteer_cpf: string;
  volunteer_is_active: boolean;
};

export type VolunteerRequest = Omit<Volunteer, 'volunteer_id'>; 

