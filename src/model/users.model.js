/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} password
 */

import { pool } from "../lib/db.js";

/**
 *
 * @type {User[]}
 */
const usersData = [
    { id: 1, email: "test@gmail.com", password: "12345" },
    { id: 2, email: "piu@gmail.com", password: "54321" },
    { id: 3, email: "asd@gmail.com", password: "asdas1" },
    { id: 4, email: "iho@gmail.com", password: "nfds54dsg321" },
    { id: 5, email: "yqufd@gmail.com", password: "acv54dnf321" },
    { id: 6, email: "nklva@gmail.com", password: "543jt21" },
    { id: 8, email: "oklnjh@gmail.com", password: "je54321" },
    { id: 9, email: "sdbs@gmail.com", password: "mgf54321" },
    { id: 10, email: "mkl@gmail.com", password: "yuo54321" },
];

// console.log(usersData.length)

function findUserIndex(id) {
    return usersData.findIndex((user) => user.id === id);
}

/**
 *
 * @returns {User[]}
 */
export async function getAllUsers() {
    const sql = `
 select id, email, password from users
 order by id asc;`;

    const { rows: user } = await pool.query(sql);
    return user;
}

/**
 * @param {number} id
 * @returns {User}
 */
export async function getUserById(id) {
    const sql = `
 select id, email, password from users
 where id = $1
 order by id asc;`;

    const values = [id];

    const {
        rows: [user],
    } = await pool.query(sql, values);
    if (!user) {
        throw new Error("user not found");
    }
    return user;
}

/**
 * @param {string} email
 * @returns {User}
 */
export async function getUserByEmail(email) {
    const sql = `
    SELECT id, email, password 
    FROM users 
    WHERE email = $1
  `;

    const values = [email];

    const { rows: data } = await pool.query(sql, values);

    if (data.length === 0) {
        throw new Error("user not found");
    }

    return data[0]; 
}

let lastId = 10;

/**
 *
 * @param {User} data
 * @returns {User}
 */
export async function createUser(data) {
    try {
        const get = await getUserByEmail(data.email);
        if (get.email === data.email) {
            throw new Error("user already exists");
        }
    } catch {
        const newUser = {
            id: ++lastId,
            ...data,
        };

        usersData.push(newUser);

        return newUser;
    }
}

/**
 *
 * @param {number} id
 * @param {User} data
 * @returns {User}
 */
export async function updateUser(id, data) {
    const index = findUserIndex(id);
    if (index !== -1) {
        usersData[index] = {
            ...usersData[index],
            ...data,
        };
        return usersData[index];
    } else {
        throw new Error("user not found");
    }
}

/**
 * @param {number} id
 * @returns {User}
 */
export async function deleteUser(id) {
    const found = findUserIndex(id);
    const user = usersData[found];
    if (found !== -1) {
        usersData.splice(found, 1);
        return user;
    } else {
        throw new Error("user not found");
    }
}
