import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const loggedIn = !!localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <>
      <header>
        <img src="/images/logo.webp" alt="Sweet Scoop" />
        <h1>Sweet Scoop Ice Cream Shop</h1>
        <div className="login-control">
          {!loggedIn ? (
            <Link to="/login">
              <button>Login</button>
            </Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </header>

      <div className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/flavors">Flavors</Link>
          <Link to="/order-history">Order History</Link>
        </div>
      </div>
    </>
  );
}

export default Header;