export type Animal = {
    id: number,
    name: string,
    race: string,
    animal_type: string,
    age: number,
    rescue_location: string,
    is_adopted: boolean,
    is_castrado: boolean,
    responsible_volunteer: number,
}

export type AnimalForm = {
    name: string,
    race: string,
    animal_type: string,
    age: string,
    rescue_location: string,
    is_adopted: boolean,
    is_castrado: string,
    responsible_volunteer: string,
}

export type AnimalRequest = Omit<Animal, 'id'>; 

