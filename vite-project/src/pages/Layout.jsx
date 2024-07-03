import { Outlet, Link } from "react-router-dom";
import "./Layout.Module.css";

const Layout = () => {

  const user = JSON.parse(localStorage.getItem('user'));



  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to={user ? `/home/user/${user.id}` : '#'} 
            className={!user ? 'notactive' : ''}
            >
              Home
            </Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;