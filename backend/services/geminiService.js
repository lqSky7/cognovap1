const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables. AI responses will use fallback.');
      this.genAI = null;
      return;
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  // Build system prompt based on AI type
  buildSystemPrompt(aiType, journalContext = null) {
    const basePrompt = `You are a compassionate and professional AI mental health assistant. You are here to provide emotional support, active listening, and helpful guidance. Always:

- Be empathetic and non-judgmental
- Ask thoughtful follow-up questions
- Validate the user's feelings
- Provide practical coping strategies when appropriate
- Maintain professional boundaries
- If you detect signs of crisis or self-harm, gently encourage seeking professional help

`;

    const aiTypePrompts = {
      supportive: `${basePrompt}Your personality: You are warm, encouraging, and focus on providing emotional support. Use affirming language and help users feel heard and validated. Emphasize strengths and positive coping strategies.`,
      
      analytical: `${basePrompt}Your personality: You are logical, structured, and help users analyze their thoughts and feelings. Ask probing questions to help them understand patterns and connections. Focus on problem-solving approaches.`,
      
      creative: `${basePrompt}Your personality: You are imaginative and use creative approaches like metaphors, visualization, and expressive techniques. Help users explore their emotions through creative lens and suggest artistic or expressive outlets.`,
      
      jung: `${basePrompt}Your personality: You are inspired by Carl Jung's analytical psychology. Focus on exploring unconscious patterns, dreams, archetypes, and the process of individuation. Help users understand their psychological types and shadow work.`,
      
      cbt: `${basePrompt}Your personality: You specialize in Cognitive Behavioral Therapy approaches. Help users identify negative thought patterns, cognitive distortions, and develop healthier thinking habits. Focus on the connection between thoughts, feelings, and behaviors.`
    };

    let prompt = aiTypePrompts[aiType] || aiTypePrompts.supportive;

    if (journalContext && journalContext.length > 0) {
      prompt += `\n\nContext from user's recent journal entries:\n`;
      journalContext.forEach((entry, index) => {
        prompt += `Entry ${index + 1} (${entry.entry_date}): ${entry.title ? entry.title + ' - ' : ''}${entry.content.substring(0, 200)}${entry.content.length > 200 ? '...' : ''}\n`;
      });
      prompt += `\nYou may reference these entries if relevant to provide more personalized support.`;
    }

    prompt += `\n\nRespond in a warm, conversational tone. Keep responses focused and not too lengthy (aim for 2-3 sentences unless more detail is specifically needed).`;

    return prompt;
  }

  async generateResponse(userMessage, aiType, journalContext = null, conversationHistory = []) {
    try {
      // If Gemini is not available, use fallback
      if (!this.genAI) {
        return this.getFallbackResponse(userMessage);
      }

      const systemPrompt = this.buildSystemPrompt(aiType, journalContext);
      
      // Build conversation context
      let prompt = systemPrompt + "\n\nConversation:\n";
      
      // Add recent conversation history (last 5 messages)
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        const role = msg.sender === 'user' ? 'User' : 'AI';
        prompt += `${role}: ${msg.content}\n`;
      });
      
      prompt += `User: ${userMessage}\nAI:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text.trim(),
        referencedEntries: journalContext ? journalContext.map(entry => entry.entry_id) : [],
        aiProvider: 'gemini'
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Return fallback response on error
      return this.getFallbackResponse(userMessage);
    }
  }

  async generateStreamingResponse(userMessage, aiType, user_id, conversationId) {
    try {
      // If Gemini is not available, return fallback as single chunk
      if (!this.genAI) {
        const fallback = this.getFallbackResponse(userMessage);
        return [{ text: () => fallback.content }];
      }

      // Get context for streaming
      const JournalEntry = require('../models/journalEntry');
      const Message = require('../models/message');
      
      let journalContext = [];
      
      // Get journal context if user allows it (simplified for streaming)
      const journalEntries = await JournalEntry.find({ 
        user_id, 
        accessible_in_chat: true 
      })
      .sort({ created_at: -1 })
      .limit(3);

      if (journalEntries.length > 0) {
        journalContext = journalEntries;
      }

      // Get recent conversation history
      const conversationHistory = await Message.find({ 
        conversation_id: conversationId 
      })
      .sort({ created_at: -1 })
      .limit(10);

      const systemPrompt = this.buildSystemPrompt(aiType, journalContext);
      
      // Build conversation context
      let prompt = systemPrompt + "\n\nConversation:\n";
      
      // Add recent conversation history (last 5 messages)
      const recentHistory = conversationHistory.slice(-5).reverse();
      recentHistory.forEach(msg => {
        const role = msg.sender === 'user' ? 'User' : 'AI';
        prompt += `${role}: ${msg.content}\n`;
      });
      
      prompt += `User: ${userMessage}\nAI:`;

      // Use generateContentStream for real-time streaming
      const result = await this.model.generateContentStream(prompt);
      
      // Return the async iterable stream
      return result.stream;

    } catch (error) {
      console.error('Gemini streaming error:', error);
      
      // Return fallback as async iterable
      const fallback = this.getFallbackResponse(userMessage);
      return {
        async *[Symbol.asyncIterator]() {
          yield { text: () => fallback.content };
        }
      };
    }
  }

  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let response = "";

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      response = "I hear that you're feeling sad right now. Those feelings are valid and it's okay to sit with them. Can you tell me more about what might be contributing to these feelings?";
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      response = "Anxiety can feel overwhelming. I want you to know that what you're experiencing is real and valid. Let's try to break down what you're worried about. What specific thoughts are going through your mind right now?";
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
      response = "I can sense your frustration. Anger often tells us that something important to us isn't being honored or respected. What do you think might be underneath this anger?";
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good')) {
      response = "It's wonderful to hear that you're feeling good! I'd love to hear more about what's contributing to these positive feelings. What's been going well for you lately?";
    } else {
      response = "Thank you for sharing that with me. I can hear that there's a lot on your mind. Can you help me understand more about what you're experiencing right now? I'm here to listen and support you.";
    }

    return {
      content: response,
      referencedEntries: [],
      aiProvider: 'fallback'
    };
  }

  // Check if user message contains crisis indicators
  detectCrisis(message) {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die', 'not worth living',
      'self harm', 'hurt myself', 'cut myself', 'overdose', 'end it all'
    ];
    
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  getCrisisResponse() {
    return {
      content: "I'm really concerned about what you're sharing with me. Your life has value and you deserve support. Please reach out to a mental health professional or crisis helpline immediately. In the US, you can call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line). If you're in immediate danger, please call 911. I'm here to support you, but I want to make sure you get the professional help you need right now.",
      referencedEntries: [],
      aiProvider: 'crisis',
      flaggedForCrisis: true
    };
  }
}

module.exports = new GeminiService();
