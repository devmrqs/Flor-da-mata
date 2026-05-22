import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <NavLink to="/">
        <img src="..." alt="Logotexto da Flor da Mata" />
      </NavLink>
      <ul>
        <li>
          <NavLink to="/produtos">Produtos</NavLink>
        </li>
        <li>
          <NavLink to="/encontre">Encontre-nos</NavLink>
        </li>
        <li>
          <NavLink to="/sobre">Sobre</NavLink>
        </li>
      </ul>
      <button></button>
    </nav>
  );
};

export default Navbar;
