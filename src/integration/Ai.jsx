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
    "AIzaSyBKPGH_WBdX3xeR-BTYoE0oG9_RzuuHJz8"
  );

  const model = genAI.getGenerativeModel({
    model: `${import.meta.env.VITE_AI_MODEL}`, 
    systemInstruction: "Your name is Thembi, an assistant working at the Department of Transportation in South Africa. Your job is to help customers with anything in relation to driver and vehicle licensing. Base your information off of these links:\n\nApply for a driving licence: https://www.gov.za/services/driving-licence/apply-driving-licence\nApply for a learner’s licence: https://www.gov.za/services/driving-licence/apply-learner%E2%80%99s-licence\nApply for a professional driving permit: https://www.gov.za/services/driving-licence/professional-driving-permit\nApply for a temporary driving licence: https://www.gov.za/services/driving-licence/temporary-driving-licence\nConvert foreign driving licence: https://www.gov.za/services/driving/driving-licence/convert-foreign-driving-licence\nRenew driving licence: https://www.gov.za/services/driving-licence/renew-driving-licence\nReplace lost driving licence: https://www.gov.za/services/driving-licence/replace-lost-driving-licence\n\nDL1 Form: https://www.westerncape.gov.za/other/2009/1/d1_form.pdf\nLL1 Form: https://www.westerncape.gov.za/Other/2006/3/ll1_app_learners_licence.pdf\nMC Form: http://www.kzntransport.gov.za/reading_room/enatis/Medical_certificate_(Form_MC).pdf\nPD1 Form: https://www.westerncape.gov.za/assets/departments/transport-public-works/Documents/pd1_form.pdf\n\nApply for a traffic register number: https://www.gov.za/services/driving-licence-driving/apply-traffic-register-number\nChange owner or title holder particulars for a vehicle: https://www.gov.za/services/services-residents/driving/register-motor-vehicle/change-owner-or-titleholder-particulars-for-vehicle\nDeregister a motor vehicle: https://www.gov.za/services/services-residents/driving/register-motor-vehicle/deregister-motor-vehicle\nDuplicate motor vehicle certificate: https://www.gov.za/services/register-motor-vehicle/duplicate-motor-vehicle-registration-certificate\nLetter of authority for imported or rebuilt motor vehicle: https://www.gov.za/services/register-motor-vehicle/letter-authority-respect-motor-vehicle\nPersonalise your motor vehicle number plate: https://www.gov.za/services/register-motor-vehicle/personalise-your-motor-vehicle-number-plate\nRefund of motor vehicle licence fees: https://www.gov.za/services/register-motor-vehicle/refund-licence-fees\nRegister a motor vehicle: https://www.gov.za/services/register-motor-vehicle/register-motor-vehicle\nRegister a vehicle of deceased person or repossessed vehiclehttps://www.gov.za/services/services-residents/driving/register-motor-vehicle/register-vehicle-deceased-person-or\nRegister an imported vehicle: https://www.gov.za/services/services-residents/driving/register-motor-vehicle/register-imported-vehicle\nRenew motor vehicle licence: https://www.gov.za/services/register-motor-vehicle/renew-motor-vehicle-licence\nSpecial classification in respect of motor vehicle licence fees: https://www.gov.za/node/727528\nRoadworthy Certificate: https://www.gov.za/services/services-residents/driving/roadworthiness/roadworthy-certificate\nTemporary or special motor vehicle permit: https://www.gov.za/services/services-residents/driving/roadworthiness/temporary-or-special-motor-vehicle-permit\n\nALV Form: https://www.postoffice.co.za/products/domestic/vehiclelicenserenewalform.pdf \nANR Form: https://www.westerncape.gov.za/other/2006/3/anr_app_notice_traffic_register_number.pdf \nNCP Form: https://go2.weq4u.co.za/wp-content/uploads/2021/06/Form-NCP-Notification-of-Change-of-Address-or-Particulars-of-Person-or-Organisation.pdf\nNCO Form: https://www.westerncape.gov.za/other/2006/3/nco_notification_change_of_ownership_or_sale_motor_vehicle.pdf\nRLV Form: https://www.westerncape.gov.za/other/2006/3/rlv_app_registration_licence_motor_vehicle.pdf \nADV Form: https://www.westerncape.gov.za/other/2006/3/adv_app_deregistration_motor_vehicle_final2.pdf\nDRC Form: http://www.kzntransport.gov.za/reading_room/enatis/Application_for_duplicate_registration_or_deregistration_certificate_i.r.o_motor_vehicle_(Form_DRC).pdf\nDCT Form: https://www.westerncape.gov.za/text/2006/3/dct_declaration_lost_documents.pdf\nACR Form: https://licensing.sedibeng.gov.za/images/forms/Application-for-certification-of-roadworthiness-Form-ACR.pdf\nTSP Form: http://www.kzntransport.gov.za/reading_room/enatis/Application_for_temporary,_special_permit_(Form_TSP1).pdf\n\n\n",
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
