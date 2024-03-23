export type Resource = {
  resource_id: number;
  resource_description: string;
  resource_price: number;
  resource_volunteer_id: number;
};

export type ResourceRequest = Omit<Resource, 'resource_id'>; 

