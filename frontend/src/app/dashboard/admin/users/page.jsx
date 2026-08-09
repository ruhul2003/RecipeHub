'use client';

import { useState, useEffect } from 'react';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Users, Lock, Unlock, Crown, ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (userId) => {
    try {
      const res = await API.patch(`/admin/users/${userId}/block-toggle`);
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: res.data.isBlocked } : u))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Block action failed.');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching platform registered users..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Manage Platform Users</h1>
        <p className="text-slate-500 text-sm">View user accounts and manage block/unblock privileges.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Membership Tier</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img src={u.image} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {u.isPremium ? (
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center space-x-1 w-fit">
                        <Crown className="w-3 h-3 fill-current" />
                        <span>PRO CHEF</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Standard</span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    {u.isBlocked ? (
                      <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleBlockToggle(u._id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 ml-auto transition-colors ${
                          u.isBlocked
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {u.isBlocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unblock User</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Block User</span>
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
