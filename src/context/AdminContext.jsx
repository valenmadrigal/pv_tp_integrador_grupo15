import { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

  const [admin, setAdmin] = useState(null);

  const login = (nombre, sector) => {
    setAdmin({
      nombre,
      sector
    });
  };

  const logout = () => {
    setAdmin(null);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        login,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};