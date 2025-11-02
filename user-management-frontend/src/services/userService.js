import axios from 'axios';

export const userService = {
    API_BASE_URL: 'http://localhost:8080/users',

    async getAllUsers() {
        const response = await axios.get(`${this.API_BASE_URL}/all`);
        return response;
    },

    async getUserByEmail(email) {
        const response = await axios.get(`${this.API_BASE_URL}/preview`, {
            params: { email }
        });
        return response;
    },

    async createUser(userData) {
        const response = await axios.post(`${this.API_BASE_URL}/create`, userData);
        return response;
    },

    async updateUser(email, userData) {
        const response = await axios.put(`${this.API_BASE_URL}/update`, userData, {
            params: { email }
        });
        return response;
    },

    async deleteUser(email) {
        const response = await axios.delete(`${this.API_BASE_URL}/delete`, {
            params: { email }
        });
        return response;
    }
};