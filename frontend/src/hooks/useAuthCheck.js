import { useEffect } from "react";
import { isTokenValid, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid()) {
      removeToken();
      navigate("/login");
    }
  }, []);
};

export default useAuthCheck;
