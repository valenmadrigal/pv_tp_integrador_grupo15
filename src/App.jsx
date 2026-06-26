import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AdminContext } from "./context/AdminContext";


import Login from "./views/Login";
import ListaClientes from "./views/ListaClientes";
import DetalleCliente from "./views/DetalleCliente";
import Dashboard from "./views/Dashboard";


import Header from "./components/layout/Header";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";


function App() {


  const { admin } = useContext(AdminContext);



  return (

    <Routes>


      {/* LOGIN */}

      <Route

        path="/login"

        element={

          admin

          ?

          <Navigate to="/" />

          :

          <Login />

        }

      />




      {/* PAGINA PRINCIPAL */}
      
     <Route
      
      path="/"
      
      element={
        
        admin ? (
        
        <>
        
           <Header />
        
           <Nav />

           <main>

           <Dashboard />

           </main>
       
           <Footer />
         
        </>
        ) : (
          <Navigate to="/login" />
        )
      }
     />




      {/* LISTA CLIENTES */}

      <Route

        path="/clientes"

        element={

          admin

          ?

          <>

            <Header />
            
            <Nav />
            
            <main>
             
              <ListaClientes />
            
            </main>
            
            <Footer />

          </>

          :

          <Navigate to="/login" />

        }

      />




      {/* DETALLE CLIENTE */}

      <Route

        path="/clientes/:id"

        element={

          admin

          ?

          <>

            <Header />

            <Nav />
            
            <main>
              <DetalleCliente />
            
            </main>
            <Footer />

            </>

          :

          <Navigate to="/login" />

        }

      />




      {/* RUTA DESCONOCIDA */}

      <Route

        path="*"

        element={

          <Navigate

            to={admin ? "/" : "/login"}

          />

        }

      />


    </Routes>

  );

}



export default App;