import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, RefreshCw } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from './api';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';

export default function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
        showToast('Unexpected response format from server', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast(`Failed to load users: ${error.message}`, 'error');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteUser(user.id);
      showToast(`User "${user.name}" deleted successfully`, 'success');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast(`Failed to delete user: ${error.message}`, 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      if (selectedUser?.id) {
        await updateUser(selectedUser.id, {
          name: formData.name,
          role: formData.role,
        });
        showToast(`User "${formData.name}" updated successfully`, 'success');
      } else {
        await createUser(formData);
        showToast(`User "${formData.name}" created successfully`, 'success');
      }
      handleModalClose();
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      showToast(`Failed to save user: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">NiFi Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchUsers}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                title="Refresh users"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleAddUser}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.role === 'Admin').length}
                </p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className="text-sm text-gray-500">Editors</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter((u) => u.role === 'Editor').length}
                </p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className="text-sm text-gray-500">Viewers</p>
                <p className="text-2xl font-bold text-gray-600">
                  {users.filter((u) => u.role === 'Viewer').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        {isLoading ? (
          <LoadingSpinner text="Loading users..." />
        ) : (
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            NiFi User Management Dashboard &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        isLoading={isSubmitting}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
