import { ReactNode, useEffect } from "react";
import { BACKEND_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { setUsername } = useAppContext();

  const isUserAuthenticated = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/isAuth`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUsername(data.username);
      }

      if (!res.ok) {
        navigate("/auth");
        setUsername(data.username);
      }
    } catch (error) {
      navigate("/auth");
    }
  };

  useEffect(() => {
    isUserAuthenticated();
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
