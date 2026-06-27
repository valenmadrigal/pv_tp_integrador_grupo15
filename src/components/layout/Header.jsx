import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

function Header() {
  const { admin, logout } = useContext(AdminContext);

  return (
    <header>
      <div className="header-brand">
        <img
          src="/favicon.svg"
          alt="Logo Sistema Administrativo"
          className="header-logo"
        />
        <h2>Sistema Administrativo</h2>
      </div>

      {admin && (
        <div className="header-user">
          <p>
            Usuario: <strong>{admin.nombre}</strong>
          </p>
          <p>
            Sector: <strong>{admin.sector}</strong>
          </p>
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      )}
    </header>
  );
}

export default Header;
