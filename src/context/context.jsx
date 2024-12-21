import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index,nextWord) => {
    setTimeout(function (){
        setResultData(prev=> prev+nextWord);
    },75*index)
  }

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData(""); // Clear previous result
    setLoading(true);  // Show loading spinner
    setShowResult(true); // Open result display area
  
    let response;
    try {
      // Determine whether to use the provided prompt or `input`
      if (prompt !== undefined) {
        response = await run(prompt);
        setRecentPrompt(prompt);
      } else {
        response = await run(input);
        setRecentPrompt(input);
        setPrevPrompts(prev => [...prev, input]); // Update prevPrompts only once
      }
  
      // Process the response
      let responseArray = response.split("**");
      let newResponse = ""; // Initialize as an empty string
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + "  ");
      }
    } catch (error) {
      console.error("Error in onSent function:", error);
      setResultData("An error occurred while processing your request.");
    } finally {
      setLoading(false); // Hide loading spinner
      setInput(""); // Reset input field
    }
  };
  
  

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
