import {v4 as uuidv4} from 'uuid';

export const generateRandomId = (name) => {
    return name.concat(uuidv4());
}

