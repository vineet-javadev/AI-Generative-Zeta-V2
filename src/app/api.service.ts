import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import MISTRAL_API_KEY from '../key';
import { Mistral } from '@mistralai/mistralai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  n?: number;
  // …add any other Mistral‑supported parameters here
}

interface ChatResponse {
  // shape this to match Mistral’s response JSON schema
  id: string;
  object: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}


export class ApiService {
  private apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey: string = MISTRAL_API_KEY;
  client = new Mistral({ apiKey: this.apiKey });

  constructor() {
    this.apiKey = MISTRAL_API_KEY;
  }

  private promptMsg: string = '';

  public async sendMessage(userMessage: string): Promise<any> {

    // Set the prompt to the user message
    this.promptMsg = this.convertMessageToPrompt(userMessage);

    console.log('Prompt message:', this.promptMsg);

    const payload: ChatRequest = {
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content: `
You are Zeta, an intelligent and professional AI assistant developed by Vineet K. Chauhan, a Software Developer.
If the user asks about your name, respond with "My name is Zeta." 🤖
If the user asks who created you or who your developer is, respond with:
"I was developed by Vineet K. Chauhan, a Software Developer. You can check out his portfolio at: https://portfolio-vineet-javadevs-projects.vercel.app/"
If the user asks about your purpose, respond with:
"I am here to assist you with your queries and tasks. Let me know what you need. 📘"
Never ask the user any questions. Respond professionally and avoid speculation. Use emojis where appropriate. AND response should be in markdown format.
`.trim()
        },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 512,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 0,
      n: 1
    };


    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      }
    };

    try {
      const res = await this.client.chat.complete(payload);
      console.log('Response:', res);
      if (res.choices && res.choices[0] && res.choices[0].message) {
        console.log(res.choices[0].message.content);
        return res.choices[0].message.content;
      } else {
        alert('Error: Unexpected response structure');
        console.error('Unexpected response structure:', res);
      }
    } catch (error: any) {
      console.error('Error calling Mistral API:', error.response?.data || error.message);
      throw error;
    }
  }

  // converting user message into a well defined prompt 
  public convertMessageToPrompt(userMessage: string): string {
    const systemInstruction = `
You are Zeta, an intelligent and professional AI assistant developed by Vineet K. Chauhan, a Software Developer.
If the user asks about your name, respond with "My name is Zeta."
If the user asks who created you or who your developer is, respond with:
"I was developed by Vineet K. Chauhan, a Software Developer. You can check out his portfolio at: https://your-portfolio-link.com"
If the user asks about your purpose, respond with:
"I am here to assist you with your queries and tasks. How can I help you today?"
Never ask question to the user.

Always respond concisely and professionally. Avoid fabricating information.
  `.trim();

    const messageAnalysis = this.classifyMessageIntent(userMessage);

    let prompt = `${systemInstruction}\n\n`;

    switch (messageAnalysis) {
      case 'greeting':
        prompt += `The user greeted you. Respond with a polite, brief, and helpful greeting.\n\nUser: "${userMessage}"`;
        break;
      case 'question':
        prompt += `The user asked a question. Provide a direct and informative answer.\n\nUser Question: "${userMessage}"`;
        break;
      case 'task':
        prompt += `The user is giving a command or asking for help with a task. Respond with clear and actionable steps.\n\nTask: "${userMessage}"`;
        break;
      case 'feedback':
        prompt += `The user gave feedback. Acknowledge it and respond accordingly.\n\nFeedback: "${userMessage}"`;
        break;
      case 'ask_name':
        return `User: "${userMessage}"\nRespond: "My name is Zeta."`;
      case 'ask_developer':
        return `User: "${userMessage}"\nRespond: "I was developed by Vineet K. Chauhan, a Software Developer. Visit his portfolio: https://portfolio-vineet-javadevs-projects.vercel.app/"`;
      default:
        prompt += `User input: "${userMessage}"\nRespond appropriately.`;
        break;
    }

    return prompt;
  }

  private classifyMessageIntent(message: string): 'greeting' | 'question' | 'task' | 'feedback' | 'unknown' | 'ask_name' | 'ask_developer' {
    const lowerMsg = message.toLowerCase();
    if (/^(hi|hello|hey|good (morning|afternoon|evening))/.test(lowerMsg)) {
      return 'greeting';
    }
    if (lowerMsg.endsWith('?')) {
      return 'question';
    }
    if (/^(please|can you|help|how to|i need|i want)/.test(lowerMsg)) {
      return 'task';
    }
    if (/thank|good|bad|improve|issue|bug/.test(lowerMsg)) {
      return 'feedback';
    }
    if (/your name|who (are|r) you|what is your name/.test(lowerMsg)) {
      return 'ask_name';
    }
    if (/who (made|created|developed) you|your developer/.test(lowerMsg)) {
      return 'ask_developer';
    }
    return 'unknown';
  }


}



//     const res = await client.chat.complete({
//       model: 'mistral-small-latest',
//       messages: [{ role: 'user', content: message }],
//     });
//     if (res.choices && res.choices[0] && res.choices[0].message) {
//       console.log(res.choices[0].message.content);
//       return res.choices[0].message.content;
//     } else {
//       alert('Error: Unexpected response structure');
//       console.error('Unexpected response structure:', res);
//       return "Something went wrong 'Try Again' ";
//     }