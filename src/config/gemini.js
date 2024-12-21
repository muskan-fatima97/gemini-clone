

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai"
  
  const apiKey = "AIzaSyB0f2rP6W7A9UACP9cPHfKBgpJ-do0Lur4";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    try {
      const result = await chatSession.sendMessage(prompt);
      console.log(result.response.text());
      return result.response.text(); // Use 'result' instead of 'response'
    } catch (error) {
      console.error("Error in run function:", error);
      throw error; // Re-throw the error if needed for debugging
    }
  }
  
  
  export default run;