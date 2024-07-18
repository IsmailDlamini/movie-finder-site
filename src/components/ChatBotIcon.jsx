import propTypes from "prop-types";
import ismail_bot from "../assets/ismail-bot.png";

const ChatBotIcon = ({ changeChatBotState, chatBotState }) => {
  const iconStyling = {
    position: "fixed",
    bottom: "3%",
    right: "2%",
    zIndex: "2",
  };

  const imageStyling = {
    width: "70px",
    cursor: "pointer",
  };

  return (
    <>
      <div
        className="chat-bot-icon"
        style={iconStyling}
        onClick={() =>
          chatBotState ? changeChatBotState(false) : changeChatBotState(true)
        }
      >
        <img src={ismail_bot} alt="ismail-bot-icon" style={imageStyling} />
      </div>
    </>
  );
};

ChatBotIcon.propTypes = {
  changeChatBotState: propTypes.func.isRequired,
  chatBotState: propTypes.bool.isRequired,
};

export default ChatBotIcon;
