import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// System prompts for different contexts
export const SYSTEM_PROMPTS = {
  GENERAL: `You are OptiK AI, an expert assistant for the OptiK token creation platform. 
You help users with token creation, deployment strategies, market analysis, and blockchain development.
Be helpful, professional, and provide actionable advice.`,
  
  TOKEN_CREATION: `You are OptiK AI, specialized in Solana token creation and deployment.
Help users with token specifications, tokenomics design, launch strategies, and technical requirements.
Provide detailed explanations and best practices for token development.`,
  
  MARKET_ANALYSIS: `You are OptiK AI, a cryptocurrency market analyst.
Provide insights on market trends, token performance, trading strategies, and risk management.
Base your analysis on current market conditions and historical data.`,
  
  TECHNICAL_SUPPORT: `You are OptiK AI, a technical support specialist for blockchain development.
Help users troubleshoot issues, explain technical concepts, and provide step-by-step guidance.
Focus on Solana blockchain, token standards, and smart contract development.`,
};

export async function createChatCompletion(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: request.model || 'gpt-4o-mini',
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.max_tokens || 1000,
      stream: request.stream || false,
    });

    return response as ChatResponse;
  } catch (error) {
    console.error('Error creating chat completion:', error);
    throw error;
  }
}

export async function createStreamingChatCompletion(request: ChatRequest) {
  try {
    const stream = await openai.chat.completions.create({
      model: request.model || 'gpt-4o-mini',
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.max_tokens || 1000,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('Error creating streaming chat completion:', error);
    throw error;
  }
}

export function createSystemMessage(prompt: keyof typeof SYSTEM_PROMPTS): ChatMessage {
  return {
    role: 'system',
    content: SYSTEM_PROMPTS[prompt],
  };
}

export function createUserMessage(content: string): ChatMessage {
  return {
    role: 'user',
    content,
  };
}

export function createAssistantMessage(content: string): ChatMessage {
  return {
    role: 'assistant',
    content,
  };
}

export function validateChatRequest(request: any): request is ChatRequest {
  return (
    request &&
    Array.isArray(request.messages) &&
    request.messages.length > 0 &&
    request.messages.every((msg: any) => 
      msg.role && 
      msg.content &&
      ['system', 'user', 'assistant'].includes(msg.role)
    )
  );
}

export function sanitizeMessage(content: string): string {
  // Remove potential harmful content
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 10000); // Limit length
}

export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

export function truncateMessages(messages: ChatMessage[], maxTokens: number = 8000): ChatMessage[] {
  let totalTokens = 0;
  const truncatedMessages: ChatMessage[] = [];

  // Keep system message if it exists
  if (messages[0]?.role === 'system') {
    truncatedMessages.push(messages[0]);
    totalTokens += estimateTokens(messages[0].content);
  }

  // Add messages in reverse order (most recent first)
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === 'system') continue; // Already added
    
    const messageTokens = estimateTokens(message.content);
    if (totalTokens + messageTokens > maxTokens) break;
    
    truncatedMessages.unshift(message);
    totalTokens += messageTokens;
  }

  return truncatedMessages;
}

export async function generateTokenAdvice(tokenName: string, tokenSymbol: string, description?: string): Promise<string> {
  const messages: ChatMessage[] = [
    createSystemMessage('TOKEN_CREATION'),
    createUserMessage(`I'm creating a token called "${tokenName}" with symbol "${tokenSymbol}". ${description ? `Description: ${description}. ` : ''}Please provide advice on tokenomics, launch strategy, and best practices.`)
  ];

  const response = await createChatCompletion({ messages });
  return response.choices[0]?.message.content || 'Unable to generate advice at this time.';
}

export async function analyzeMarketTrend(query: string): Promise<string> {
  const messages: ChatMessage[] = [
    createSystemMessage('MARKET_ANALYSIS'),
    createUserMessage(query)
  ];

  const response = await createChatCompletion({ messages });
  return response.choices[0]?.message.content || 'Unable to analyze market trend at this time.';
}

export async function provideTechnicalSupport(issue: string): Promise<string> {
  const messages: ChatMessage[] = [
    createSystemMessage('TECHNICAL_SUPPORT'),
    createUserMessage(issue)
  ];

  const response = await createChatCompletion({ messages });
  return response.choices[0]?.message.content || 'Unable to provide technical support at this time.';
}