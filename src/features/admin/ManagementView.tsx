import React, { useState, useEffect } from "react";
import {
  IconArrowLeft,
  IconSearch,
  IconFilter,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Pagination } from "@/components/Pagination";
import { ROLES, type ROLE, type User } from "@/types";
import { MOCK_USERS } from "@/services/storageUser";

// Component for managing user roles and permissions
export default function ManagementView() {
  // State for all users and filtered users
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State for search and pagination
  const searchRef = React.useRef<string>("");
  const timer = React.useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSearched, setIsSearched] = useState<boolean>(false);

  // State for role management
  const [newRole, setNewRole] = useState<ROLE>(ROLES.USER);
  const [projectId, setProjectId] = useState<string>("");
  const [projectIds, setProjectIds] = useState<string[]>([]);

  // Constants for pagination
  const MAX_ELEMS = 5;
  const TOTAL_PAGES = Math.ceil(filteredUsers.length / MAX_ELEMS);

  // Load users on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(MOCK_USERS);
  }, []);

  // Search functionality
  const runSearch = () => {
    const search = searchRef.current.toLowerCase().trim();

    if (search === "") {
      setFilteredUsers(users);
      setIsSearched(true);
      return;
    }

    const filtered = users.filter((user) => {
      const nameWords = user.name.toLowerCase().split(/\s+/);
      const emailWords = user.email.toLowerCase().split(/\s+/);
      const roleWords = user.role.toLowerCase().split(/\s+/);

      const allWords = [...nameWords, ...emailWords, ...roleWords];

      // Exact match
      const exactMatch = allWords.includes(search);
      if (exactMatch) return true;

      // Partial match
      return allWords.some((word) => word.startsWith(search));
    });

    setFilteredUsers(filtered);
    setIsSearched(true);
  };

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchRef.current = e.target.value;

    if (timer.current) clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      runSearch();
    }, 500);
  };

  // Handle pagination
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // Select user to edit
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setProjectIds(user.permissions?.projectIds || []);
  };

  // Update user role
  const handleUpdateRole = () => {
    if (!selectedUser) return;

    const updatedUser = {
      ...selectedUser,
      role: newRole,
      permissions: {
        ...selectedUser.permissions,
        projectIds: projectIds,
      },
    };

    // Update user in the list
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? updatedUser : user
    );

    // setUsers(updatedUsers);
    // setFilteredUsers(
    //   filteredUsers.map((user) =>
    //     user.id === selectedUser.id ? updatedUser : user
    //   )
    // );

    // In a real app, this would be an API call to update the user
    // For now, we'll just update the state
    alert(`Роль пользователя ${selectedUser.name} обновлена на ${newRole}`);

    // Reset selection
    setSelectedUser(null);
  };

  // Add project ID to user permissions
  const handleAddProjectId = () => {
    if (!projectId.trim()) return;

    // Don't add duplicates
    if (projectIds.includes(projectId)) {
      alert("Этот ID проекта уже добавлен");
      return;
    }

    setProjectIds([...projectIds, projectId]);
    setProjectId("");
  };

  // Remove project ID from user permissions
  const handleRemoveProjectId = (idToRemove: string) => {
    setProjectIds(projectIds.filter((id) => id !== idToRemove));
  };

  // Initialize search on component mount
  useEffect(() => {
    runSearch();
  }, [users]);

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-10 bg-white">
      <div className="w-full max-w-6xl flex flex-col gap-6 px-4">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-[#e6f7ff] transition"
          >
            <IconArrowLeft
              size={24}
              className="text-black group-hover:text-[#1daff7]"
            />
            <span className="font-['PPRader'] text-[16px] text-black group-hover:text-[#1daff7] hidden sm:inline">
              Назад
            </span>
          </Link>

          <h1 className="font-['PPRader'] text-[28px] md:text-[36px] text-black tracking-tight text-center flex-1">
            Управление пользователями
          </h1>

          <div className="w-[72px] md:w-[100px]" />
        </header>

        <section className="space-y-8">
          <div className="relative w-full max-w-2xl mx-auto">
            <IconSearch
              size={22}
              className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="search"
              placeholder="Поиск пользователей по имени или email"
              className="w-full pl-9 py-4 text-[18px] font-['PPRader'] text-black bg-transparent border-0 border-b-2 border-black focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-[#1daff7] transition"
          >
            <IconFilter size={20} />
            <span className="font-['PPRader'] text-[14px]">Фильтры</span>
          </button>
        </section>

        <div className="flex flex-col md:flex-row gap-6">
          {/* User list */}
          <div className="flex-1">
            <h2 className="font-['PPRader'] text-[22px] text-black mb-4">
              Список пользователей
            </h2>

            {isSearched && filteredUsers.length === 0 ? (
              <p className="text-center py-4">Пользователи не найдены</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="py-2 px-4 text-left">Имя</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Роль</th>
                      <th className="py-2 px-4 text-left">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers
                      .slice(
                        (currentPage - 1) * MAX_ELEMS,
                        currentPage * MAX_ELEMS
                      )
                      .map((user) => (
                        <tr
                          key={user.id}
                          className={`border-b border-gray-200 hover:bg-gray-50 ${
                            selectedUser?.id === user.id ? "bg-[#e6f7ff]" : ""
                          }`}
                        >
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.role}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleSelectUser(user)}
                              className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-[#1daff7] transition"
                            >
                              Изменить
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredUsers.length > MAX_ELEMS && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={TOTAL_PAGES}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* User edit form */}
          <div className="w-full md:w-[350px] p-6 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="font-['PPRader'] text-[22px] text-black mb-4">
              {selectedUser ? "Изменить пользователя" : "Выберите пользователя"}
            </h2>

            {selectedUser ? (
              <div className="space-y-4">
                <div>
                  <p className="font-['PPRader'] text-[16px] text-black">
                    {selectedUser.name}
                  </p>
                  <p className="font-['PPRader'] text-[14px] text-gray-500">
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                  <label className="block font-['PPRader'] text-[16px] text-black mb-2">
                    Роль пользователя
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as ROLE)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1daff7]"
                  >
                    <option value={ROLES.USER}>Пользователь (USER)</option>
                    <option value={ROLES.ADMIN}>Администратор (ADMIN)</option>
                    <option value={ROLES.PROJECT_ADMIN}>
                      Администратор проекта (PROJECT_ADMIN)
                    </option>
                    <option value={ROLES.WORKSPACE_ADMIN}>
                      Администратор рабочего пространства (WORKSPACE_ADMIN)
                    </option>
                  </select>
                </div>

                {newRole === ROLES.PROJECT_ADMIN && (
                  <div>
                    <label className="block font-['PPRader'] text-[16px] text-black mb-2">
                      ID проектов (nameId)
                    </label>

                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        placeholder="Введите ID проекта"
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-[#1daff7]"
                      />
                      <button
                        onClick={handleAddProjectId}
                        className="p-2 bg-black text-white rounded hover:bg-[#1daff7] transition"
                      >
                        <IconPlus size={20} />
                      </button>
                    </div>

                    <div className="mt-2 space-y-2">
                      {projectIds.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Нет добавленных проектов
                        </p>
                      ) : (
                        projectIds.map((id) => (
                          <div
                            key={id}
                            className="flex items-center justify-between p-2 bg-gray-100 rounded"
                          >
                            <span className="font-['PPRader'] text-[14px]">
                              {id}
                            </span>
                            <button
                              onClick={() => handleRemoveProjectId(id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <IconTrash size={18} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpdateRole}
                  className="w-full py-2 bg-black text-white rounded hover:bg-[#1daff7] transition"
                >
                  Сохранить изменения
                </button>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                Выберите пользователя из списка для редактирования
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filter modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="font-['PPRader'] text-[18px] text-black">Фильтры</h2>
            <p className="font-['PPRader'] text-[14px] text-gray-500 mt-2">
              Фильтрация по ролям пользователей
            </p>

            <div className="mt-4 space-y-2">
              {Object.values(ROLES).map((role) => (
                <div key={role} className="flex items-center">
                  <input type="checkbox" id={`role-${role}`} className="mr-2" />
                  <label
                    htmlFor={`role-${role}`}
                    className="font-['PPRader'] text-[14px]"
                  >
                    {role}
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="mt-6 ml-auto block px-4 py-2 bg-black text-white rounded hover:bg-[#1daff7] transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
