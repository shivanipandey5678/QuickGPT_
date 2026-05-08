import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/useContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const Chatbox = () => {
  const containerRef = useRef(null);

  const { selectedChat, theme, axios, token, user, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text"); // "text" | "image"
  const [isPublished, setIsPublished] = useState(false);

  const modeOptions = [
    { value: "text", label: "Text (ChatGPT)" },
    { value: "image", label: "Image" },
  ];

  useEffect(() => {
    const list = selectedChat?.message;
    setMessages(Array.isArray(list) ? list : []);
  }, [selectedChat]);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast("Please login to send a message.");
      if (!selectedChat?._id) return toast("Please wait, loading chat...");
      if (mode === "image" && user.credit < 2) {
        toast.error(
          "You need at least 2 credits to generate an image. Buy more credits to continue."
        );
        return;
      }
      if (mode !== "image" && user.credit < 1) {
        toast.error(
          "You need at least 1 credit to send a message. Buy more credits to continue."
        );
        return;
      }
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const isImage = mode === "image";
      const apiMode = isImage ? "image" : "text";
      const payload = {
        chatId: selectedChat._id,
        prompt: String(prompt),
        isPublished: !!isPublished,
      };

      const { data } = await axios.post(
        `/api/message/${apiMode}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          // Force body to be sent as JSON string so it always reaches backend
          transformRequest: [(body) => JSON.stringify(body)],
        }
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);
        if (isImage) {
          setUser((prev) => ({ ...prev, credit: prev.credit - 2 }));
        } else {
          setUser((prev) => ({ ...prev, credit: prev.credit - 1 }));
        }
        setPrompt("");
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Something went wrong.";
      toast.error(msg);
      setPrompt(promptCopy);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col justify-between m-4 sm:m-5 md:m-10 xl:mx-16 2xl:mx-24 max-md:mt-14 2xl:pr-40 w-full min-w-0 overflow-hidden">
      {/* chat messages */}

      <div className="flex-1 mb-5 overflow-y-scroll" ref={containerRef}>
    
        {(!messages || messages.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo_full"
              className="w-full max-w-56 sm:max-w-72"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white ">
              Ask me anything.
            </p>
          </div>
        )}

        {(messages || []).map((message, i) => (
          <Message key={i} message={message} />
        ))}

        {/* three dots animation */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-3 text-sm mx-auto">
          <p className="text-xs">Publish to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* One dropdown: Text (ChatGPT) | Image | Hitesh | Zakir */}
      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#806609F]/30 rounded-2xl w-full max-w-2xl p-2 sm:p-3 mx-auto flex gap-2 sm:gap-3 items-center min-w-0"
      >
        <select
          className="text-xs sm:text-sm outline-none rounded-xl px-2 sm:px-3 py-2 border border-primary/50 dark:border-white/20 bg-white/80 dark:bg-white/10 shrink-0 w-[130px] sm:w-[140px]"
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          title="Text=ChatGPT, Image=generate, Hitesh/Zakir=chat with them"
          aria-label="Chat mode"
        >
          {modeOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-purple-900">
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          className="outline-none flex-1 min-w-0 py-2 px-3 rounded-xl bg-transparent placeholder:text-gray-500 dark:placeholder:text-purple-200/60"
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 p-2 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
          aria-label="Send"
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt=""
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
