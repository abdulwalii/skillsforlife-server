import { generateRandomId, generateHash } from '../src/genericFunctions.js'
export const USERS = [
    {
        id: generateRandomId('user_'),
        userName: 'Admin',
        email: 'admin@gmail.com',
        password: await generateHash('0000'),
    },
]