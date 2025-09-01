const Conversation = require('../models/conversation');
const Message = require('../models/message');
const JournalEntry = require('../models/journalEntry');
const geminiService = require('../services/geminiService');
const { v4: uuidv4 } = require('uuid');

// AI Types and their personas
const AI_TYPES = {
  supportive: {
    name: "Supportive AI",
    description: "A caring and encouraging AI therapist",
    prompt: "You are a supportive and empathetic AI therapist. Your goal is to provide encouragement, validate feelings, and help users feel heard and supported. Use warm, caring language and focus on strengths and positive coping strategies."
  },
  analytical: {
    name: "Analytical AI",
    description: "A logical and structured AI therapist",
    prompt: "You are an analytical AI therapist who helps users understand their thoughts and feelings through logical analysis. Ask thoughtful questions, help identify patterns, and provide structured approaches to problem-solving."
  },
  creative: {
    name: "Creative AI", 
    description: "A creative and expressive AI therapist",
    prompt: "You are a creative AI therapist who uses metaphors, storytelling, and creative exercises to help users explore their emotions. Encourage creative expression and use imaginative approaches to therapy."
  },
  jung: {
    name: "Jungian AI",
    description: "An AI based on Carl Jung's analytical psychology",
    prompt: "You are an AI therapist inspired by Carl Jung's analytical psychology. Focus on exploring the unconscious, dreams, archetypes, and the process of individuation. Help users understand their psychological types and inner conflicts."
  },
  cbt: {
    name: "CBT AI",
    description: "An AI specializing in Cognitive Behavioral Therapy",
    prompt: "You are an AI therapist specializing in Cognitive Behavioral Therapy. Help users identify negative thought patterns, challenge cognitive distortions, and develop healthier thinking habits. Focus on the connection between thoughts, feelings, and behaviors."
  }
};

// Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { ai_type = 'supportive', title, journal_access_enabled = true } = req.body;
    const user_id = req.user.user_id;

    // Validate AI type
    if (!AI_TYPES[ai_type]) {
      return res.status(400).json({ 
        message: 'Invalid AI type', 
        available_types: Object.keys(AI_TYPES)
      });
    }

    const conversation_id = uuidv4();
    
    const conversation = new Conversation({
      conversation_id,
      user_id,
      ai_therapist_id: ai_type, // Store AI type in ai_therapist_id field
      title: title || `Chat with ${AI_TYPES[ai_type].name}`,
      type: 'therapy',
      journal_access_enabled,
      last_message_at: new Date()
    });

    await conversation.save();

    // Create initial greeting message from AI
    const greeting_message_id = uuidv4();
    const greeting = `Hello! I'm your ${AI_TYPES[ai_type].name}. ${AI_TYPES[ai_type].description}. How are you feeling today? Feel free to share what's on your mind.`;
    
    const greetingMessage = new Message({
      message_id: greeting_message_id,
      conversation_id,
      user_id,
      sender: 'ai',
      content: greeting
    });

    await greetingMessage.save();

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation: {
        ...conversation.toObject(),
        ai_type,
        ai_info: AI_TYPES[ai_type]
      },
      initial_message: greetingMessage
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({ user_id })
      .skip(skip)
      .limit(limit)
      .sort({ last_message_at: -1 });

    // Get the last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversation_id: conv.conversation_id })
          .sort({ created_at: -1 })
          .limit(1);
        
        return {
          ...conv.toObject(),
          last_message: lastMessage
        };
      })
    );

    const total = await Conversation.countDocuments({ user_id });

    res.json({
      conversations: conversationsWithLastMessage,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_conversations: total,
        has_next: page < Math.ceil(total / limit),
        has_prev: page > 1
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single conversation with messages
const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user_id = req.user.user_id;

    const conversation = await Conversation.findOne({ 
      conversation_id: conversationId, 
      user_id 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Get messages for this conversation
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation_id: conversationId })
      .skip(skip)
      .limit(limit)
      .sort({ created_at: 1 }); // Oldest first for chat

    const totalMessages = await Message.countDocuments({ conversation_id: conversationId });

    res.json({
      conversation,
      messages,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(totalMessages / limit),
        total_messages: totalMessages,
        has_next: page < Math.ceil(totalMessages / limit),
        has_prev: page > 1
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message in a conversation
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const user_id = req.user.user_id;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const conversation = await Conversation.findOne({ 
      conversation_id: conversationId, 
      user_id 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Create user message
    const message_id = uuidv4();
    const userMessage = new Message({
      message_id,
      conversation_id: conversationId,
      user_id,
      sender: 'user',
      content
    });

    await userMessage.save();

    // Update conversation last message time
    conversation.last_message_at = new Date();
    await conversation.save();

    // Check for crisis indicators
    const isCrisis = geminiService.detectCrisis(content);
    if (isCrisis) {
      const crisisResponse = geminiService.getCrisisResponse();
      
      const ai_message_id = uuidv4();
      const aiMessage = new Message({
        message_id: ai_message_id,
        conversation_id: conversationId,
        user_id,
        sender: 'ai',
        content: crisisResponse.content,
        flagged_for_crisis: true
      });

      await aiMessage.save();

      return res.json({
        message: 'Messages sent successfully',
        user_message: userMessage,
        ai_response: aiMessage,
        crisis_detected: true
      });
    }

    // Generate AI response using Gemini
    const aiResponse = await generateAIResponse(content, conversation, user_id);
    
    const ai_message_id = uuidv4();
    const aiMessage = new Message({
      message_id: ai_message_id,
      conversation_id: conversationId,
      user_id,
      sender: 'ai',
      content: aiResponse.content,
      referenced_journal_entries: aiResponse.referencedEntries || []
    });

    await aiMessage.save();

    res.json({
      message: 'Messages sent successfully',
      user_message: userMessage,
      ai_response: aiMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user_id = req.user.user_id;

    const conversation = await Conversation.findOneAndDelete({ 
      conversation_id: conversationId, 
      user_id 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Delete all messages in this conversation
    await Message.deleteMany({ conversation_id: conversationId });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available AI types
const getAITypes = async (req, res) => {
  try {
    const aiTypes = Object.keys(AI_TYPES).map(key => ({
      id: key,
      ...AI_TYPES[key]
    }));

    res.json({
      ai_types: aiTypes
    });
  } catch (error) {
    console.error('Get AI types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// AI response generator using Gemini
async function generateAIResponse(userMessage, conversation, user_id) {
  try {
    let journalContext = [];
    let referencedEntries = [];

    // Get journal context if enabled
    if (conversation.journal_access_enabled) {
      const journalEntries = await JournalEntry.find({ 
        user_id, 
        accessible_in_chat: true 
      })
      .sort({ created_at: -1 })
      .limit(3);

      if (journalEntries.length > 0) {
        journalContext = journalEntries;
        referencedEntries = journalEntries.map(entry => entry.entry_id);
      }
    }

    // Get recent conversation history for context
    const conversationHistory = await Message.find({ 
      conversation_id: conversation.conversation_id 
    })
    .sort({ created_at: -1 })
    .limit(10);

    // Get AI type from conversation (stored in ai_therapist_id field)
    const aiType = conversation.ai_therapist_id || 'supportive';

    // Generate response using Gemini
    const response = await geminiService.generateResponse(
      userMessage,
      aiType,
      journalContext,
      conversationHistory.reverse() // Reverse to get chronological order
    );

    return {
      content: response.content,
      referencedEntries: response.referencedEntries || referencedEntries,
      aiProvider: response.aiProvider
    };

  } catch (error) {
    console.error('AI response generation error:', error);
    return {
      content: "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.",
      referencedEntries: [],
      aiProvider: 'error'
    };
  }
}

module.exports = {
  createConversation,
  getConversations, 
  getConversation,
  sendMessage,
  deleteConversation,
  getAITypes
};
