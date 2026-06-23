import { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [nombre, setNombre] = useState("");
  const [sector, setSector] = useState("Soporte");

  const { login } = useContext(AdminContext);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(nombre, sector);

    navigate("/");
  };

  return (
    <div>
      <h2>Login Administrador</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="Soporte">Soporte</option>
            <option value="Gerencia">Gerencia</option>
          </select>
        </div>

        <button type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;