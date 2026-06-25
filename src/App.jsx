import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";

import Login from "./views/Login";
import ListaClientes from "./views/ListaClientes";
import DetalleCliente from "./views/DetalleCliente";

function App() {
  const { admin } = useContext(AdminContext);

  return (
    <Routes>

      <Route
        path="/login"
        element={
          admin ? <Navigate to="/" /> : <Login />
        }
      />

      <Route
        path="/"
        element={
          admin ? <ListaClientes /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/clientes"
        element={
          admin ? <ListaClientes /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/clientes/:id"
        element={
          admin ? <DetalleCliente /> : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}

export default App;