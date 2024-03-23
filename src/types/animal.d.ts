export type Animal = {
    animal_id: number,
    animal_name: string,
    animal_race: string,
    animal_type: string,
    animal_age: number,
    animal_rescue_location: string,
    animal_is_adopted: boolean,
    animal_is_castrado: boolean,
    animal_responsible_volunteer: number,
}

export type AnimalRequest = Omit<Animal, 'animal_id'>; 
