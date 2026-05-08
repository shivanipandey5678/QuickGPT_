import React, {useState } from "react";
import { useAppContext } from "../context/useContext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    axios,
    createNewChat,
    setChats,
    setToken,
    fetchUsersChats,
    token,
  } = useAppContext();
  const [search, setSearch] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  
    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.reload();
    }, 1000); 
  };

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirm) return;
      setLoadingChats(true);
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setLoadingChats(false);
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUsersChats();
        toast.success(data.message ," catch deleteChat sidebar");
      }
    } catch (error) {
      toast.success(error.message ," catch deleteChat sidebar");
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-72 max-w-[85vw] max-md:w-[85vw] min-w-0 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30
     backdrop-blur-3xl transition-all duration-500 max-md:absolute max-md:left-0 max-md:top-0 max-md:z-50 ${
       !isMenuOpen ? "max-md:-translate-x-full" : ""
     }`}
    >
      {/* logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="logo"
        className="w-full max-w-48"
      />

      <img
        src={assets.close_icon}
        alt="close_icon"
        className="absolute right-4 top-6 w-4 cursor-pointer hover:scale-110 transition-all delay-75 not-dark:invert md:hidden"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* new chat button */}
      <button
        className="flex justify-center items-center w-full py-2 mt-7 text-white bg-gradient-to-r from-[#A456f7] to-[#3D81F6] text-sm rounded-md cursor-pointer"
        onClick={createNewChat}
      >
        <span className="mr-2 text-xl">+</span>New Chat
      </button>

      {/* search conversation */}
      <div className="flex items-center gap-4 p-2 mt-2 border border-gray-400 dark:border-white/20 rounded-md">
        <img
          src={assets.search_icon}
          alt="search_icon"
          className="w-4 not-dark:invert "
        />
        <input
          type="text"
          placeholder="Search Conversation"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="outline-none"
        />
      </div>
      {loadingChats}
      {/* recent chats */}
      {chats?.length > 0 && (
        <p className="text-sm mt-4 font-medium">Recent Chats</p>
      )}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3 cursor-pointer">
        {chats?.length > 0 &&
          chats
            .filter((chat) =>
              chat.message?.[0]
                ? chat.message[0]?.content
                    .toLowerCase()
                    .includes(search.toLowerCase())
                : chat.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                className="border p-2 rounded-md  flex justify-between items-center group hover:scale-99 transition-all delay-75  border-gray-400  dark:border-white/20"
              >
                <div className="flex flex-col ">
                  <p className="w-full truncate">
                    {chat.message?.length > 0
                      ? chat.message[0].content.slice(0, 32)
                      : chat.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>
                <img
                  src={assets.del_icon}
                  alt="del_icon"
                  className="hidden w-5 hover:scale-130 transition-all group-hover:block "
                  onClick={(e) =>
                    toast.promise(deleteChat(e, chat._id), {
                      loading: "deleting...",
                    })
                  }
                />
              </div>
            ))}
      </div>

      <div></div>

      <div className="mt-5">
        <div
          onClick={() => {
            navigate("/community");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-4 p-3 mt-2 border border-gray-400 dark:border-white/20 rounded-md hover:scale-99 transition-all delay-75 cursor-pointer"
        >
          <img
            src={assets.gallery_icon}
            alt="search_icon"
            className="w-4 not-dark:invert "
          />
          <p className="font-medium">Community Images</p>
        </div>

        <div
          onClick={() => {
            navigate("/credits");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-4 p-2 mt-2  border border-gray-400 dark:border-white/20 rounded-md hover:scale-99 transition-all delay-75 cursor-pointer"
        >
          <img
            src={assets.diamond_icon}
            alt="search_icon"
            className="w-4 dark:invert  "
          />
          <div>
            <p className="font-medium">Credits : {user.credit}  </p>
            <p className="text-xs text-gray-500 dark:text-white">
              Purchase credits to use quickGPT
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 mt-2 p-3 border border-gray-400 dark:border-white/20 rounded-md hover:scale-99 transition-all delay-75 cursor-pointer">
          <div className="flex gap-4">
            <img
              src={assets.theme_icon}
              alt="search_icon"
              className="w-4 not-dark:invert"
            />
            <p className="font-medium">Dark mode</p>
          </div>
          <label className="relative inline-flex cursor-pointer">
            <input
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
            />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full trasnition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>

        <div className="flex items-center gap-4 p-3 mt-2 border border-gray-400 dark:border-white/20 rounded-md cursor-pointer group">
          <img
            src={assets.user_icon}
            alt="search_icon"
            className="w-7 rounded-full  "
          />
          <p className="flex-1 text-sm dark:text-primary truncate">
            {user ? user.name : "Login your account"}
          </p>
          {user && (
            <img
              src={assets.logout_icon}
              onClick={logout}
             
              className="hidden group-hover:block w-5 h-5  not-dark:invert md:hidden cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
