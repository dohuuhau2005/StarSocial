// AdminPage.jsx
import React, { useState, useMemo, use, useEffect } from 'react';
import {
  FiSearch, FiPlus, FiEdit, FiTrash2, FiMoreHorizontal,
  FiChevronDown, FiLogOut, FiSettings
} from 'react-icons/fi';
import { CgData } from "react-icons/cg";
import { Link } from 'react-router-dom';
import AddUserModal from '../Components/AddUserModal';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ca, tr } from 'date-fns/locale';
import { u } from 'framer-motion/client';


// Initial dummy user data to match PostgreSQL structure status
const initialUsers = [
  { Email: 'john.smith@gmail.com', Last_name: 'John', First_Name: 'Smith', full_name: 'Last_name + " " + First_Name', isLocked: false, Role: 'Admin', Created_at: '2025-03-12' },
  { Email: 'dwarren3@gmail.com', Last_name: 'John', First_Name: 'Smith', full_name: 'David Warren', isLocked: true, Role: 'User', Created_at: '2025-01-08' },
  { Email: 'belleclark@gmail.com', Last_name: 'John', First_Name: 'Smith', full_name: 'Belle Clark', isLocked: false, Role: 'Handle Report', Created_at: '2025-08-30' },
  { Email: 'lucamich@gmail.com', Last_name: 'John', First_Name: 'Smith', full_name: 'Luca Mich', isLocked: false, Role: 'User', Created_at: '2025-04-23' },
  { Email: 'markwill32@gmail.com', Last_name: 'John', First_Name: 'Smith', full_name: 'Mark Williams', isLocked: true, Role: 'User', Created_at: '2025-01-14' },
  { Email: 'noemivill99@gmail.com', Last_name: 'John', First_Name: 'Smith', full_name: 'Noemi Villas', isLocked: false, Role: 'Admin', Created_at: '2025-08-10' },//joined_date
];
initialUsers.forEach(user => {
  user.full_name = `${user.First_Name} ${user.Last_name}`// Default password for all users
});
// --- Sub-Components ---

const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-sm rounded-full font-semibold";
  const statusClasses = {
    Active: 'bg-green-100 text-green-700',
    Banned: 'bg-red-200 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);
  return (
    <aside className="w-64 bg-white fixed top-0 left-0 bottom-0 border-r shadow z-50 flex flex-col justify-between">
      <div>
        <div className="h-20 flex items-center px-6 border-b">
          <Link to="/admin" className="flex items-center pl-3 group mr-3">
            <img src="/src/assets/Logo.png" alt="Logo" className="w-10 h-10 object-contain hover:scale-105 transition-all" />
          </Link>
          <h1 className="text-xl font-bold">Hello <span className="text-blue-600">Admin</span></h1>
        </div>
        <nav className="px-4 py-6 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <CgData className="mr-3 text-xl" />
            Decentralization
          </a>
        </nav>
      </div>
      <div className="px-4 py-4 relative">
        <button onClick={() => setShowMore(!showMore)} className="flex items-center w-full text-left text-gray-700 hover:text-black cursor-pointer">
          <FiMoreHorizontal className="mr-3 text-xl" />
          More
        </button>
        {showMore && (
          <div className="absolute bottom-16 left-4 bg-white border shadow-lg rounded w-40 z-10">
            <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer">
              <FiSettings className="mr-2" /> Settings
            </button>
            <Link to="/login" className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm text-red-600">
              <FiLogOut className="mr-2" /> Logout
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

const Header = ({ searchTerm, setSearchTerm, onOpenModal }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b w-full">
      <div className="relative w-full mr-4">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          autoComplete="off"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={onOpenModal}
        className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer whitespace-nowrap"
      >
        <FiPlus className="mr-2" /> Add User
      </button>
    </header>
  );
};

const MonthlyStats = ({ users }) => {
  const monthlyData = useMemo(() => {
    const stats = {};
    users.forEach(user => {
      const date = new Date(user.Created_at);
      const month = date.toLocaleString('en-us', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      stats[key] = (stats[key] || 0) + 1;
    });
    return stats;
  }, [users]);

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly User Statistics (2025)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(monthlyData).map(([month, count]) => (
          <div key={month} className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">{month}</p>
            <p className="text-2xl font-bold text-blue-700">{count}</p>
            <p className="text-sm text-gray-500">new users</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const UserTable = ({ users, searchTerm, onEdit, onDelete }) => {
  const filteredUsers = users.filter(user =>
    user.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr className='text-left text-gray-500'>
            <th className="p-4">Email <FiChevronDown className="inline ml-1" /></th>
            <th className="p-4">Status <FiChevronDown className="inline ml-1" /></th>
            <th className="p-4">Role <FiChevronDown className="inline ml-1" /></th>
            <th className="p-4">Joined Date <FiChevronDown className="inline ml-1" /></th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.Email} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-800">{user.Email}</td>
              <td className="p-4"><StatusBadge status={user.isLocked ? "Banned" : "Active"} /></td>
              <td className="p-4 text-gray-600">{user.Role}</td>
              <td className="p-4 text-gray-600">{new Date(user.Created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}</td>
              <td className="p-4 text-center">
                <button onClick={() => onEdit(user)} className="text-gray-500 hover:text-blue-600 mr-4"><FiEdit size={18} /></button>
                <button onClick={() => onDelete(user.Email)} className="text-gray-500 hover:text-red-600"><FiTrash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// --- Main Component: AdminPage ---

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const backendLink = import.meta.env.VITE_Link_backend;

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${backendLink}/admin/getAllUsers`, {
          headers: {
            'authorization': `${token}` // Kẹp vé vào
          }
        }
        )
        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          console.error("Failed to fetch users:", res.data.error);
        }
      } catch (error) {
        console.error("Error fetching users from backend:", error.response?.data?.error || error.message);
      }
    })();
  }, []);


  const handleOpenAddModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = (emailToDelete) => {
    if (window.confirm(`Are you sure you want to delete user: ${emailToDelete}?`)) {
      setUsers(users.filter(user => user.Email !== emailToDelete));
      (async () => {
        const token = localStorage.getItem('token');
        try {
          await axios.delete(`${backendLink}/admin/deleteUser/${emailToDelete}`, {
            headers: {
              'authorization': `${token}` // Kẹp vé vào
            }
          })
        }
        catch (error) {
          console.error("Error deleting user from backend:", error.response?.data?.error || error.message);
          alert("Đã có lỗi xảy ra khi xóa người dùng khỏi backend. Vui lòng thử lại.");
        }
      })();
    }
  };

  const handleSaveUser = (userData) => {
    const token = localStorage.getItem('token');
    const specialCharsRegex = /[^a-zA-Z0-9]/;
    if (editingUser) {
      setUsers(users.map(user => {
        if (user.Email === editingUser.Email) {
          if (userData.Role == user.Role && userData.isLocked == user.isLocked && userData.Password == "") {
            alert("No changes detected. User not updated.");
            return user;
          }
          if (specialCharsRegex.test(userData.Password)) {
            alert("Password cannot contain special characters.");
            return user;
          }
          let changed = false;
          if (userData.Password) {
            alert("User updated successfully."); changed = true;
            axios.put(`${backendLink}/admin/updateUser/${user.Email}`, userData, {
              headers: {
                'authorization': `${localStorage.getItem('token')}` // Kẹp vé vào
              }
            }).catch(error => {
              console.error("Error updating user in backend:", error.response?.data?.error || error.message);

            });
          } else {
            alert("User updated successfully without changing password."); changed = false;
            axios.put(`${backendLink}/admin/updateUserNoPassword/${user.Email}`, userData, {
              headers: {
                'authorization': `${localStorage.getItem('token')}` // Kẹp vé vào
              }
            }).catch(error => {
              console.error("Error updating user in backend:", error.response?.data?.error || error.message);

            });
          };
          const newPassword = userData.Password ? userData.Password : user.Password;
          console.log("Updated user data:", { userData, Password: newPassword });
          console.log("Password changed:", changed);

          return { ...user, ...userData, Password: newPassword };
        }
        return user;
      }));
    } else {
      const newUser = {
        ...userData,

      };
      console.log("Adding new user data:", userData);
      axios.post(`${backendLink}/admin/insertUsers`, userData, {
        headers: {
          'authorization': `${token}` // Kẹp vé vào
        }
      }).catch(error => {
        console.error("Error adding user to backend:", error.response?.data?.error || error.message);
        alert("Đã có lỗi xảy ra khi thêm người dùng vào backend. Vui lòng thử lại.");
      });
      setUsers(prevUsers => [newUser, ...prevUsers]);
      window.location.reload();
    }
    setModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col">
        <div className="m-6 bg-white rounded-lg shadow">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onOpenModal={handleOpenAddModal} />
          <MonthlyStats users={users} />
          <UserTable
            searchTerm={searchTerm}
            users={users}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteUser}
          />
        </div>

        <AnimatePresence>
          {modalOpen && (
            <AddUserModal
              onClose={() => {
                setModalOpen(false);
                setEditingUser(null);
              }}
              onSubmit={handleSaveUser}
              initialData={editingUser}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPage;