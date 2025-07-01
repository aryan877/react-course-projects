import { AuthContext } from "@/contexts/AuthContext";
import { getMe, login as loginApi, register as registerApi } from "@/utils/api";
import { useEffect, useState } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.data);
        } catch (err) {
          localStorage.removeItem("token");
          console.error("Auth check failed", err);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    localStorage.setItem("token", res.data.token);
    const userRes = await getMe();
    setUser(userRes.data.data);
    return userRes;
  };

  const register = async (username, displayName, email, password) => {
    const res = await registerApi(username, displayName, email, password);
    localStorage.setItem("token", res.data.data.token);
    const userRes = await getMe();
    setUser(userRes.data.data);
    return userRes.data.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
