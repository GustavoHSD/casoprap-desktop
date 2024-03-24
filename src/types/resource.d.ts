export type Resource = {
  resource_id: number;
  resource_description: string;
  resource_price: number;
  resource_volunteer_id: number;
};

<<<<<<< HEAD
export type ResourceRequest = Omit<Resource, 'id'>; 
=======
export type ResourceRequest = Omit<Resource, 'resource_id'>; 
>>>>>>> main

