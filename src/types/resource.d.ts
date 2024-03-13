export type Resource = {
  id: number;
  description: string;
  price: number;
  volunteer_id: number;
};

export type ResourceReq = Omit<Resource, 'id'>; 

