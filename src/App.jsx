import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AdminContext } from "./context/AdminContext";
import { PERMISOS } from "./constants/perfiles";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./views/Login";
import ListaClientes from "./views/ListaClientes";
import DetalleCliente from "./views/DetalleCliente";
import Dashboard from "./views/Dashboard";

import Header from "./components/layout/Header";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";

function LayoutAutenticado({ children }) {
  return (
    <>
      <Header />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  const { estaAutenticado } = useContext(AdminContext);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          estaAutenticado ? <Navigate to="/" replace /> : <Login />
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute permiso={PERMISOS.VER_DASHBOARD}>
            <LayoutAutenticado>
              <Dashboard />
            </LayoutAutenticado>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <ProtectedRoute permiso={PERMISOS.VER_CLIENTES}>
            <LayoutAutenticado>
              <ListaClientes />
            </LayoutAutenticado>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clientes/:id"
        element={
          <ProtectedRoute permiso={PERMISOS.VER_CLIENTES}>
            <LayoutAutenticado>
              <DetalleCliente />
            </LayoutAutenticado>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={estaAutenticado ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
