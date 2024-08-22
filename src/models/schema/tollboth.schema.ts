import { TollbothType } from '../../types/tollboth.type';

class Tollboth {
    id: number;
    name: string;

    constructor({ id, name }: TollbothType) {
        this.id = id;
        this.name = name;
    }
}

export default Tollboth;
