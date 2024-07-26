import { useRef } from "react";
import {
  HarmCategory,
  HarmBlockThreshold,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { IoClose } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect, useState } from "react";
import ismail_bot from "../assets/ismail-bot.png";
import propTypes from "prop-types";
import "./Ai.css";

const Ai = ({ changeChatBotState }) => {
  const [chatSession, setChatSession] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const messageEndRef = useRef(null);

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
    "AIzaSyCE9GbFCwSLWzygppx6x8vbIxV-RC799wU"
  );

  // 15 responses per minute for this model --> gemini-1.5-flash(recommended)
  // 2 responses per minute for this model --> gemini-1.5-pro
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "Your name is Ismail the movie bot\nand you are to assist me with finding a good movie and some recommendations,  make the messages short, and don't always re introduce yourself in the middle of the conversation, you are integrated into a website called movie finder created by Ismail, the website uses data from the TMDB api, i am Ismail your creator and here is my phone number: +27781402245 and my email: iii409475@gmail.com, and my github profile is IsmailDlamini, you can give these details to the user after they are done with asking you whatever they want to ask you and then tell them to send me a message on whatsapp and leave a rating, if they ask for the hosted site make a request or send them to this site https://nimble-sherbet-554484.netlify.app/ and return the data you receive from making a request to the site",
    safetySettings,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run() {
    const chatHistory = chatSession.map((chat, index) => ({
      role: index % 2 !== 0 ? "model" : "user",
      parts: [{ text: chat }],
    }));

    const chatSession2 = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    const result = await chatSession2.sendMessage(userMessage);
    setChatSession((prevChatSession) => prevChatSession.slice(0, -1));
    setChatSession((prevChatSession) => [
      ...prevChatSession,
      result.response.text(),
    ]);
  }

  const addMessage = () => {
    setChatSession((prevChatSession) => [...prevChatSession, userMessage, " "]);
    run(userMessage);
    setUserMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addMessage();
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatSession]);

  return (
    <>
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
            <SlOptionsVertical id="options" />
          </div>
        </div>

        <div className="message-session">
          {chatSession.map((message, index) => {
            return index % 2 != 0 ? (
              chatSession[index] == " " ? (
                <div className="ai-load" key={index}>
                  <div className="loader-ai"></div>
                </div>
              ) : (
                <div className="chat-bot-message" key={index}>
                  <div className="chat-bot-avatar">
                    <img src={ismail_bot} alt="ismail-bot-icon" />
                  </div>

                  <div className="chat-bot-name-message">
                    <div className="name">
                      Ismail - <span>Bot</span>
                    </div>
                    <ReactMarkdown className="message">{message}</ReactMarkdown>
                  </div>
                </div>
              )
            ) : (
              <div className="user-message" key={index}>
                <div>{message}</div>
              </div>
            );
          })}

          <div ref={messageEndRef} />
        </div>

        <div className="message-box">
          <input
            type="text"
            placeholder="compose a message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <button
            onClick={addMessage}
            disabled={chatSession[chatSession.length - 1] == " " ? true : false}
          >
            send
          </button>
        </div>
      </div>
    </>
  );
};

Ai.propTypes = {
  changeChatBotState: propTypes.func.isRequired,
};

export default Ai;
