import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "@/utils/api";
import { Loader2 } from "lucide-react";

const UserContext = createContext();

const PUBLIC_ROUTES = ["/login", "/signup"];

export const useGlobalContext = () => {
  return useContext(UserContext);
};

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/get-user");
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error.response?.data ?? error.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user && !PUBLIC_ROUTES.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
        <Loader2 className="text-black w-8 h-8 animate-spin"/>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default GlobalContextProvider;
