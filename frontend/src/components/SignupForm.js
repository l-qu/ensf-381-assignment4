import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DisplayStatus from "./DisplayStatus";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();

  const validateForm = () => {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_-]{2,19}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      return { type: "error", message: "All fields are required." };
    }

    if (!usernameRegex.test(username)) {
      return {
        type: "error",
        message:
          "Username must be 3-20 characters, start with a letter, and contain only letters, numbers, underscores, and hyphens."
      };
    }

    if (!emailRegex.test(email)) {
      return {
        type: "error",
        message: "Email must be in a valid email format."
      };
    }

    if (!passwordRegex.test(password)) {
      return {
        type: "error",
        message:
          "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      };
    }

    if (password !== confirmPassword) {
      return {
        type: "error",
        message: "Confirm password must match password."
      };
    }

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setStatus(validationError);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message || "Signup successful. Redirecting to login..."
        });

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Signup failed."
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Could not connect to the backend."
      });
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSignup}>
        <h2 className="login-title">Signup</h2>

        <label>Username </label>
        <input
          className="login-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <label>Email </label>
        <input
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <label>Password </label>
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <label>Confirm Password </label>
        <input
          className="login-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />

        <button className="login-button" type="submit">
          Signup
        </button>

        <p className="forgot-password">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        {status && <DisplayStatus type={status.type} message={status.message} />}
      </form>
    </div>
  );
}

export default SignupForm;