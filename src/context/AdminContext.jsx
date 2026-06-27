import { createContext, useState, useEffect, useCallback } from "react";
import { PERMISOS_POR_PERFIL } from "../constants/perfiles";

export const AdminContext = createContext();

const STORAGE_KEY = "admin";

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const adminGuardado = localStorage.getItem(STORAGE_KEY);
    return adminGuardado ? JSON.parse(adminGuardado) : null;
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [admin]);

  const login = (nombre, sector) => {
    setAdmin({ nombre, sector });
  };

  const logout = () => {
    setAdmin(null);
  };

  const estaAutenticado = Boolean(admin);

  const tienePermiso = useCallback(
    (permiso) => {
      if (!admin?.sector) return false;
      const permisos = PERMISOS_POR_PERFIL[admin.sector] ?? [];
      return permisos.includes(permiso);
    },
    [admin]
  );

  return (
    <AdminContext.Provider
      value={{
        admin,
        login,
        logout,
        estaAutenticado,
        tienePermiso,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
