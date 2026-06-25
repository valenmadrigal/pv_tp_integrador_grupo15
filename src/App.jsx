import { Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import ListaClientes from "./views/ListaClientes";
import DetalleCliente from "./views/DetalleCliente";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ListaClientes />} />
      <Route path="/clientes" element={<ListaClientes />} />
      <Route path="/clientes/:id" element={<DetalleCliente />} />
    </Routes>
  );
}

export default App;