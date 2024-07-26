import propTypes from "prop-types";
import ismail_bot from "../assets/ismail-bot.png";
import "./ChatBotIcon.css";
import { IoCloseCircle } from "react-icons/io5";
import { useState } from "react";

const ChatBotIcon = ({ changeChatBotState, chatBotState, showHint }) => {
  const searchParams = new URLSearchParams(location.search);

  const page = searchParams.get("page");

  const [hintMessage, setHintMessage] = useState(true);

  return (
    <>
      {!page
        ? showHint
          ? hintMessage && (
              <div className="chat-bot-availability-hint">
                hello.👋 My name is Ismail the movie bot and I am here to assist
                you with movie🎬 recommendations ✨
                <IoCloseCircle
                  id="close-message-icon"
                  onClick={() => {
                    setHintMessage(!hintMessage);
                  }}
                />
              </div>
            )
          : ""
        : ""}

      <div className="chat-bot-icon">
        <img
          src={ismail_bot}
          alt="ismail-bot-icon"
          onClick={() => {
            chatBotState ? changeChatBotState(false) : changeChatBotState(true);
            setHintMessage(false);
          }}
        />
      </div>
    </>
  );
};

ChatBotIcon.propTypes = {
  changeChatBotState: propTypes.func.isRequired,
  chatBotState: propTypes.bool.isRequired,
  showHint: propTypes.string.isRequired,
};

export default ChatBotIcon;
