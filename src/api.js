// Use proxy in development, direct URL in production
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'http://server2.gpark.digital:9002';

/**
 * Fetch all users from the API
 * @returns {Promise<{success: boolean, data: Array, count: number}>}
 */
export async function getUsers() {
  const response = await fetch(`${BASE_URL}?api=read`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.role - User's role
 * @returns {Promise<Object>}
 */
export async function createUser(userData) {
  const response = await fetch(`${BASE_URL}?api=create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      role: userData.role,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing user
 * @param {string} userId - The user ID to update
 * @param {Object} userData - The updated user data
 * @param {string} userData.name - User's name
 * @param {string} userData.role - User's role
 * @returns {Promise<Object>}
 */
export async function updateUser(userId, userData) {
  const response = await fetch(`${BASE_URL}?api=update&id=${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: userData.name,
      role: userData.role,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a user
 * @param {string} userId - The user ID to delete
 * @returns {Promise<Object>}
 */
export async function deleteUser(userId) {
  const response = await fetch(`${BASE_URL}?api=delete&id=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
