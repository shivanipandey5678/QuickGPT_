import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const currancy = "$";

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const { data } = await axios.get("/api/user/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message, " else fetchUser appcontext");
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.error || error.message || "";
      if (status === 401 || msg.toLowerCase().includes("jwt expired") || msg.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(error.message, " catch fetchUser appcontext");
      }
    } finally {
      setLoadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return toast("Login to create a new chat");
      await axios.get("/api/chat/new", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsersChats();
    } catch (error) {
      toast.error(error.message," catch createNewChat appcontext");
    }
  };

  const fetchUsersChats = async () => {
    try {
      setLoadingChats(true);
      const { data } = await axios.get("/api/chat/all-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setChats([...data.chats]);
        if (data.chats.length === 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          const firstChat = data.chats[0];
          setSelectedChat(firstChat);
        }
      } else {
        toast.error(data.message, " fetchUsersChats");
      }
    } catch (error) {
      toast.error(error.message, " fetchUsersChats");
    }
  };



  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
   
  }, [user]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
      navigate("/");
    }
  }, [token]);

  const value = {
    navigate,
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    fetchUser,
    currancy,
    fetchUsersChats,
    createNewChat,
    token,
    setToken,
    axios,
    loadingUser,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
