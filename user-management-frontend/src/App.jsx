import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Alert } from './components/Alert';
import { UserTable } from './components/UserTable';
import { UserModal } from './components/UserModal';
import { userService } from './services/userService';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAllUsers();
      const userData = response.data;
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await userService.createUser(formData);
      setSuccess('User created successfully!');
      await fetchAllUsers();
      setShowModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.details?.join(', ') || 
                       'Failed to create user';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await userService.updateUser(selectedUser.email, updateData);
      setSuccess('User updated successfully!');
      await fetchAllUsers();
      setShowModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.details?.join(', ') || 
                       'Failed to update user';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user with email: ${email}?`)) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(email);
      setSuccess('User deleted successfully!');
      await fetchAllUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUserByEmail(email);
      setSelectedUser(response.data);
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch user details';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleModalSubmit = (formData) => {
    if (modalMode === 'create') {
      handleCreateUser(formData);
    } else if (modalMode === 'edit') {
      handleUpdateUser(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onAddUser={openCreateModal} />

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}

        <UserTable
          users={users}
          loading={loading}
          onView={handleViewUser}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
        />

        {showModal && (
          <UserModal
            mode={modalMode}
            user={selectedUser}
            onClose={closeModal}
            onSubmit={handleModalSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default App;