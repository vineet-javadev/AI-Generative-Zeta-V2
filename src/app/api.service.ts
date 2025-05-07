import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';

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
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async sendMessage(userMessage: string): Promise<ChatResponse> {
    const payload: ChatRequest = {
      model: 'mistral-small-latest',
      messages: [
        { role: 'user', content: userMessage }
      ],
      temperature: 1.5,
      top_p: 1,
      max_tokens: 0,
      stream: false,
      stop: undefined,
      presence_penalty: 0,
      frequency_penalty: 0,
      n: 1,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      }
    };

    try {
      const response: AxiosResponse<ChatResponse> = await axios.post(
        this.apiUrl,
        payload,
        config
      );
      console.log('Mistral response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error calling Mistral API:', error.response?.data || error.message);
      throw error;
    }
  }
}

