import { Link } from 'react-router-dom';

const NavBar = () => (
  <header className="nav">
    <div className="container nav-inner">
      <h1>Excel Catalog Platform</h1>
      <nav>
        <Link to="/">Catalog</Link>
        <Link to="/selection">Selection</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </div>
  </header>
);

export default NavBar;
