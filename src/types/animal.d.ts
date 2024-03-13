export type Animal = {
    id: number,
    name: string,
    race: string,
    a_type: string,
    age: number,
    rescue_location: string,
    is_adopted: boolean,
    is_castrated: boolean,
    responsible_volunteer: number,
}

export type AnimalReq = Omit<Animal, 'id'>; 
