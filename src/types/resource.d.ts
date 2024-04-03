export type Resource = {
  id: number;
  description: string;
  price: number;
  volunteer_id: number;
};

export type ResourceForm = {
  description: string;
  price: string;
  volunteer_id: string;
};

export type ResourceRequest = Omit<Resource, 'id'>; 

