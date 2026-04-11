import React,{useState, createContext} from "react";
import AuthMessage from "./AuthMessage";
import { Link, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

function LoginForm(){
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [status,setStatus]=useState(null)
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (username === "" || password === "") {
      setStatus({ type: "error", message: "Fields cannot be empty" });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }
    
    try{
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok){
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        setStatus({
          type: "success",
          message: data.message || "Successful login!"
        })

        setTimeout(() => {
          navigate("/flavors");
        }, 1000);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Invalid Login"
        })
      }
    } catch(error){
      setStatus({
        type: "error",
        message: "Could not connect to the backend..."
      });
    }

  };
  return(
  <AuthContext.Provider value={{status}}>

    <div className="login-form">
      <form>
      <h2 className="login-title">Login</h2>

      <label >Username </label>
      <input
        className="login-input"
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
      />

      <br/><br/>

      <label>Password </label>
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/>
      
      <button 
      className="login-button"
      onClick={handleLogin}
      >
      Login
      </button>

      <p className="forgot-password">Forgot Password?</p>
      <Link to="/signup" className = "no-button-link">Want an account? Click here to sign up!</Link>
      <AuthMessage/>
      </form>
    </div>

  </AuthContext.Provider>

  )
}

export default LoginForm;