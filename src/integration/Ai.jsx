import { useRef, useEffect, useState } from "react";
import {
  HarmCategory,
  HarmBlockThreshold,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { IoClose, IoReload } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";
import ismail_bot from "../assets/ismail-bot.png";
import propTypes from "prop-types";
import "./Ai.css";
import ReactGA from "react-ga4";
import axios from "axios";

const Ai = ({ changeChatBotState }) => {
  const storedChatSession = JSON.parse(
    sessionStorage.getItem("chatSession") || "[]"
  );

  const storedEncounteredError = JSON.parse(
    sessionStorage.getItem("errorState") || "false"
  );

  const [chatSession, setChatSession] = useState(storedChatSession);
  const [userMessage, setUserMessage] = useState("");
  const messageEndRef = useRef(null);
  const [optionShowing, setOptionShowing] = useState(false);
  const [encounteredError, setEncounteredError] = useState(
    storedEncounteredError
  );
  const [lastUserMessage, setLastUserMessage] = useState("");

  const [errorCountDownValue, setErrorCountDownValue] = useState(60);

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: `${import.meta.env.VITE_AI_MODEL}`,
    systemInstruction: import.meta.env.VITE_SYSTEM_INSTRUCTIONS,
    safetySettings,
  });

  const generationConfig = {
    temperature: import.meta.env.VITE_GENERATION_CONFIG_TEMPERATURE,
    topP: import.meta.env.VITE_GENERATION_CONFIG_TOPP,
    topK: import.meta.env.VITE_GENERATION_CONFIG_TOPK,
    maxOutputTokens: import.meta.env.VITE_GENERATION_CONFIG_MAXOUTPUTTOKENS,
    responseMimeType: `${
      import.meta.env.VITE_GENERATION_CONFIG_RESPONSEMIMETYPE
    }`,
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatSession]);

  useEffect(() => {
    sessionStorage.setItem("chatSession", JSON.stringify(chatSession));
    sessionStorage.setItem("errorState", JSON.stringify(encounteredError));
  }, [chatSession, encounteredError]);

  useEffect(() => {
    let interval;
    if (encounteredError && errorCountDownValue > 0) {
      interval = setInterval(() => {
        setErrorCountDownValue((prevCountDownValue) => {
          if (prevCountDownValue <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prevCountDownValue - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [encounteredError, errorCountDownValue]);

  async function run() {
    const chatHistory = chatSession.map((chat, index) => ({
      role: index % 2 !== 0 ? "model" : "user",
      parts: [{ text: chat }],
    }));

    const chatSession2 = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    try {
      const result = await chatSession2.sendMessage(
        encounteredError ? lastUserMessage : userMessage
      );
      setChatSession((prevChatSession) => {
        const newChatSession = [
          ...prevChatSession.slice(0, -1),
          result.response.text(),
        ];
        return newChatSession;
      });
      setEncounteredError(false);
      setErrorCountDownValue(60);
    } catch (error) {
      setChatSession((prevChatSession) => {
        const newChatSession = [...prevChatSession.slice(0, -1)];
        return newChatSession;
      });

      setEncounteredError(true);
    }
  }

  const handleSendMessage = () => {
    ReactGA.event({
      category: "User-chat",
      action: "user sent message to bot",
      label: userMessage,
    });
  };

  //Ghost Function
  const sendMessageToDatabase = (userMessage) => {
    axios.post(
      `https://${import.meta.env.VITE_REVIEW_SYSTEM_API_BASE_URL}/api/chat`,
      {
        user_message: userMessage,
      }
    );
  };

  const addMessage = () => {
    setChatSession((prevChatSession) => {
      const newChatSession = !encounteredError
        ? [...prevChatSession, userMessage, " "]
        : [...prevChatSession, " "];
      return newChatSession;
    });
    handleSendMessage();
    run();
    setLastUserMessage(userMessage);
    if (import.meta.env.VITE_ENVIRONMENT == "PRODUCTION")
      sendMessageToDatabase(userMessage);
    setUserMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && chatSession[chatSession.length - 1] !== " ") {
      addMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="close-chat-window">
          <IoClose id="close" onClick={() => changeChatBotState(false)} />
        </div>
        <div className="chat-bot-avatar">
          <img src={ismail_bot} alt="ismail-bot-icon" />
          <div className="status-green"></div>
        </div>
        <div className="chat-bot-name-status">
          <div className="chat-bot-name">
            Ismail - <span>Bot</span>
          </div>
          <div className="chat-bot-status">online</div>
        </div>
        <div className="options">
          <SlOptionsVertical
            id="options"
            onClick={() => setOptionShowing(!optionShowing)}
          />
          {optionShowing && (
            <div
              className="option-container"
              onClick={() => {
                setOptionShowing(false);
                sessionStorage.setItem("chatSession", "[]");
                changeChatBotState(false);
                setTimeout(() => {
                  changeChatBotState(true);
                }, 100);
                sessionStorage.setItem("errorState", JSON.stringify(false));
              }}
            >
              <div className="option">Reset Chat</div>
            </div>
          )}
        </div>
      </div>
      <div className="message-session">
        {chatSession.length > 0 ? (
          chatSession.map((message, index) => (
            <div
              key={index}
              className={index % 2 !== 0 ? "chat-bot-message" : "user-message"}
            >
              {index % 2 !== 0 ? (
                message === " " ? (
                  <div className="ai-load">
                    <div className="loader-ai"></div>
                  </div>
                ) : (
                  <>
                    <div className="chat-bot-avatar">
                      <img src={ismail_bot} alt="ismail-bot-icon" />
                    </div>
                    <div className="chat-bot-name-message">
                      <div className="name">
                        Ismail - <span>Bot</span>
                      </div>
                      <ReactMarkdown className="message">
                        {message}
                      </ReactMarkdown>
                    </div>
                  </>
                )
              ) : (
                <div>{message}</div>
              )}
            </div>
          ))
        ) : (
          <p id="user-guide">
            {'Type your question or say "Hi" to begin our chat!'}
          </p>
        )}
        {encounteredError && (
          <div className="error-box">
            <div className="error-message">
              An error occurred, please check your internet connection or resend
              the message. <br /> Try resending message in{" "}
              <strong>{errorCountDownValue}</strong> seconds
            </div>
            <div
              className="resend-message-button"
              onClick={() => {
                setEncounteredError(false);
                addMessage();
              }}
            >
              Resend Message <IoReload />
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      <div className="message-box">
        <input
          type="text"
          placeholder="compose a message"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={encounteredError ? true : false}
        />
        <button
          onClick={addMessage}
          disabled={
            chatSession[chatSession.length - 1] === " " || encounteredError
              ? true
              : false || userMessage === ""
          }
        >
          send
        </button>
      </div>
    </div>
  );
};

Ai.propTypes = {
  changeChatBotState: propTypes.func.isRequired,
};

export default Ai;
