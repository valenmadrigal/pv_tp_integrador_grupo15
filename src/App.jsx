import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AdminContext } from "./context/AdminContext";

import Login from "./views/Login";
import ListaClientes from "./views/ListaClientes";
import DetalleCliente from "./views/DetalleCliente";

import Header from "./components/Header";


function App() {

  const { admin } = useContext(AdminContext);


  return (

    <Routes>


      
      <Route
        path="/login"
        element={
          admin 
          ? <Navigate to="/" /> 
          : <Login />
        }
      />


      <Route
        path="/"
        element={
          admin 
          ?
          <>
            <Header />
            <ListaClientes />
          </>
          :
          <Navigate to="/login" />
        }
      />


      
      <Route
        path="/clientes"
        element={
          admin
          ?
          <>
            <Header />
            <ListaClientes />
          </>
          :
          <Navigate to="/login" />
        }
      />


     
      <Route
        path="/clientes/:id"
        element={
          admin
          ?
          <>
            <Header />
            <DetalleCliente />
          </>
          :
          <Navigate to="/login" />
        }
      />


     
      <Route
        path="*"
        element={
          <Navigate to={admin ? "/" : "/login"} />
        }
      />


    </Routes>

  );

}


export default App;