import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

function Dashboard() {
  const { admin } = useContext(AdminContext);

  return (
    <main className="container mt-4">
      <h2>Dashboard</h2>

      <div className="card p-3 mt-3">
        <h4>Administrador conectado</h4>

        <p>
          <strong>Nombre:</strong> {admin?.nombre}
        </p>

        <p>
          <strong>Sector:</strong> {admin?.sector}
        </p>
      </div>
    </main>
  );
}

export default Dashboard;