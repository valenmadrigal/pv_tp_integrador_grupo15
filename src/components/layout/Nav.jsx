import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/clientes">Clientes</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;