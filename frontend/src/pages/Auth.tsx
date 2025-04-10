import { useState } from "react";
import InputBox from "../components/InputBox";
import { BACKEND_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      return setError("fill all inputs");
    }
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (res.status === 200) {
        navigate("/");
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:p-0 p-4 h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[500px] py-10 h-auto bg-white shadow-md rounded-md flex flex-col justify-center items-center">
        <h1 className="text-[26px] font-bold text-gray-900">Employee Hub</h1>
        <p className="text-[15px] text-center w-full mt-1 font-medium text-gray-400">
          Enter your credentials to access the dashboard
        </p>
        <div className="flex flex-col w-full justify-center items-center gap-4 mt-5">
          <InputBox
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isAuth
          />
          <InputBox
            label="Password"
            placeholder="Enter your password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            isAuth
          />
        </div>
        {error && (
          <p className="text-red-600 w-full text-center mt-2">{error}</p>
        )}
        <button
          disabled={loading}
          onClick={handleLogin}
          className="md:w-[80%] w-[90%] mt-5 bg-gray-900 text-white p-2 rounded-md cursor-pointer hover:opacity-80"
        >
          {loading ? "Loading" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
