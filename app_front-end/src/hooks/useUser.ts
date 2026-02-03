/**
 * hooks/useUser.ts
 * Hook personnalisé pour gérer les données utilisateur
 */

import { useState, useEffect } from 'react';
import { ApiUser } from '../types/UserProfile.types';
import { getUserById, getAllUsers } from '../services/userService';

interface UseUserResult {
  user: ApiUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook pour récupérer un utilisateur par son ID
 * @param userId - L'ID de l'utilisateur à récupérer
 * @returns UseUserResult
 */
export const useUser = (userId: number): UseUserResult => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserById(userId);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
};

interface UseUsersResult {
  users: ApiUser[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook pour récupérer tous les utilisateurs
 * @returns UseUsersResult
 */
export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};