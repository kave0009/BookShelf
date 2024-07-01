import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const Navbar = ({ distinctItemsCount, handleLogout }) => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const history = useHistory();

  const handleLogoutClick = () => {
    handleLogout();
    setShowLoginDialog(false);
    history.push("/");
  };

  return (
    <header className="border fixed split-nav">
      <div className="nav-brand">
        <h3>
          <Link to="/">Online Bookstore</Link>
        </h3>
      </div>
      <ul className="inline">
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <button onClick={() => setShowLoginDialog(true)}>Login</button>
        </li>
        <li>
          <Link to="/cart">
            Cart <span className="badge" data-badge={distinctItemsCount}></span>
          </Link>
        </li>
        <li>
          <button onClick={handleLogoutClick}>Logout</button>
        </li>
      </ul>
      {showLoginDialog && <LoginDialog />}
    </header>
  );
};

export default Navbar;
