import axios from 'axios';
import { userService } from './userService';

// Mock axios
jest.mock('axios');

describe('userService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should fetch all users', async () => {
            const mockUsers = [
                { id: 1, name: 'John', email: 'john@test.com' },
                { id: 2, name: 'Jane', email: 'jane@test.com' }
            ];
            const mockResponse = { data: mockUsers, status: 200 };

            axios.get.mockResolvedValueOnce(mockResponse);

            const result = await userService.getAllUsers();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/users/all');
            expect(result.data).toEqual(mockUsers);
            expect(result.status).toBe(200);
        });

        it('should handle error when fetching users', async () => {
            const mockError = {
                response: {
                    data: { message: 'Server error' },
                    status: 500
                }
            };

            axios.get.mockRejectedValueOnce(mockError);

            await expect(userService.getAllUsers()).rejects.toEqual(mockError);
        });
    });

    describe('getUserByEmail', () => {
        it('should fetch user by email with proper params', async () => {
            const mockUser = { id: 1, name: 'John', email: 'john@test.com' };
            const mockResponse = { data: mockUser, status: 200 };

            axios.get.mockResolvedValueOnce(mockResponse);

            const result = await userService.getUserByEmail('john@test.com');

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:8080/users/preview',
                { params: { email: 'john@test.com' } }
            );
            expect(result.data).toEqual(mockUser);
        });

        it('should handle error when user not found', async () => {
            const mockError = {
                response: {
                    data: { message: 'User not found' },
                    status: 404
                }
            };

            axios.get.mockRejectedValueOnce(mockError);

            await expect(userService.getUserByEmail('notfound@test.com'))
                .rejects.toEqual(mockError);
        });
    });

    describe('createUser', () => {
        it('should create user with POST request', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@test.com',
                password: 'Password123!'
            };
            const mockResponse = {
                data: { id: 1, ...userData },
                status: 201
            };

            axios.post.mockResolvedValueOnce(mockResponse);

            const result = await userService.createUser(userData);

            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/users/create',
                userData
            );
            expect(result.status).toBe(201);
        });

        it('should handle validation errors', async () => {
            const userData = { name: 'J', email: 'invalid', password: 'weak' };
            const mockError = {
                response: {
                    data: {
                        message: 'Validation failed',
                        details: ['Name too short', 'Invalid email', 'Weak password']
                    },
                    status: 400
                }
            };

            axios.post.mockRejectedValueOnce(mockError);

            await expect(userService.createUser(userData)).rejects.toEqual(mockError);
        });
    });

    describe('updateUser', () => {
        it('should update user with PUT request', async () => {
            const email = 'john@test.com';
            const userData = { name: 'John Updated', email: 'john@test.com' };
            const mockResponse = {
                data: { success: true, user: userData },
                status: 200
            };

            axios.put.mockResolvedValueOnce(mockResponse);

            const result = await userService.updateUser(email, userData);

            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:8080/users/update',
                userData,
                { params: { email } }
            );
            expect(result.status).toBe(200);
        });

        it('should handle update errors', async () => {
            const mockError = {
                response: {
                    data: { message: 'User not found' },
                    status: 404
                }
            };

            axios.put.mockRejectedValueOnce(mockError);

            await expect(userService.updateUser('notfound@test.com', {}))
                .rejects.toEqual(mockError);
        });
    });

    describe('deleteUser', () => {
        it('should delete user with DELETE request', async () => {
            const email = 'john@test.com';
            const mockResponse = { data: null, status: 204 };

            axios.delete.mockResolvedValueOnce(mockResponse);

            const result = await userService.deleteUser(email);

            expect(axios.delete).toHaveBeenCalledWith(
                'http://localhost:8080/users/delete',
                { params: { email } }
            );
            expect(result.status).toBe(204);
        });

        it('should handle delete errors', async () => {
            const mockError = {
                response: {
                    data: { message: 'User not found' },
                    status: 404
                }
            };

            axios.delete.mockRejectedValueOnce(mockError);

            await expect(userService.deleteUser('notfound@test.com'))
                .rejects.toEqual(mockError);
        });
    });
});