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

    // Don't create initial greeting message automatically
    // Let the conversation start empty and create greeting only when user sends first message

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation: {
        ...conversation.toObject(),
        ai_type,
        ai_info: AI_TYPES[ai_type]
      }
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

    console.log('SendMessage called:', { conversationId, user_id, content });

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

    console.log('Found conversation:', conversation.conversation_id);

    // Check if this is the first message in the conversation
    const messageCount = await Message.countDocuments({ conversation_id: conversationId });
    const isFirstMessage = messageCount === 0;

    console.log('Message count in conversation:', messageCount, 'Is first message:', isFirstMessage);

    // Create user message first
    const message_id = uuidv4();
    console.log('Creating user message with ID:', message_id);
    const userMessage = new Message({
      message_id,
      conversation_id: conversationId,
      user_id,
      sender: 'user',
      content
    });

    console.log('Saving user message:', userMessage);
    await userMessage.save();
    console.log('User message saved successfully');

    // Update conversation last message time
    conversation.last_message_at = new Date();
    await conversation.save();
    console.log('Conversation updated successfully');

    // If this is the first message, create a greeting from AI first
    if (isFirstMessage) {
      const aiType = conversation.ai_therapist_id || 'supportive';
      const greeting_message_id = uuidv4();
      const greeting = `Hello! I'm your ${AI_TYPES[aiType].name}. ${AI_TYPES[aiType].description}. How are you feeling today?`;
      
      const greetingMessage = new Message({
        message_id: greeting_message_id,
        conversation_id: conversationId,
        user_id,
        sender: 'ai',
        content: greeting
      });

      await greetingMessage.save();
      console.log('Greeting message saved');
    }

    // Check for crisis indicators first
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

    // Return user message immediately
    res.json({
      message: 'User message sent successfully',
      user_message: userMessage,
      ai_message_id: uuidv4(), // Pre-generate AI message ID for frontend
      streaming: true
    });

    // Generate AI response in background (don't await)
    generateAndSaveAIResponse(content, conversation, user_id, conversationId);

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

// Update conversation
const updateConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const user_id = req.user.user_id;

    const conversation = await Conversation.findOneAndUpdate(
      { conversation_id: conversationId, user_id },
      { title },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ 
      message: 'Conversation updated successfully',
      conversation 
    });
  } catch (error) {
    console.error('Update conversation error:', error);
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

// Background function to generate and save AI response
async function generateAndSaveAIResponse(userMessage, conversation, user_id, conversationId) {
  try {
    const aiResponse = await generateAIResponse(userMessage, conversation, user_id);
    
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
    
    // Here you could emit to WebSocket or SSE if implemented
    console.log(`AI response generated for conversation ${conversationId}`);
    
  } catch (error) {
    console.error('Background AI response generation error:', error);
    
    // Save error response
    const ai_message_id = uuidv4();
    const errorMessage = new Message({
      message_id: ai_message_id,
      conversation_id: conversationId,
      user_id,
      sender: 'ai',
      content: "I apologize, but I'm having trouble generating a response right now. Please try again in a moment."
    });

    await errorMessage.save();
  }
}


const activeStreams = new Map();

// Stream AI response using Server-Sent Events
const streamAIResponse = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message: userMessage } = req.body;
    const user_id = req.user.user_id;

    console.log('StreamAIResponse called:', { conversationId, user_id, userMessage });

    if (!userMessage) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const conversation = await Conversation.findOne({ 
      conversation_id: conversationId, 
      user_id 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // SAVE USER MESSAGE FIRST - This was missing!
    const user_message_id = uuidv4();
    console.log('Creating user message in stream with ID:', user_message_id);
    
    const userMessageDoc = new Message({
      message_id: user_message_id,
      conversation_id: conversationId,
      user_id,
      sender: 'user',
      content: userMessage
    });

    await userMessageDoc.save();
    console.log('User message saved in stream successfully');

    // Update conversation last message time
    conversation.last_message_at = new Date();
    await conversation.save();
    console.log('Conversation updated in stream successfully');

    const ai_message_id = uuidv4();
    
    // Store this stream for potential cancellation
    const streamKey = `${user_id}:${conversationId}`;
    activeStreams.set(streamKey, {
      response: res,
      messageId: ai_message_id,
      cancelled: false,
      startTime: new Date()
    });

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
      'Content-Encoding': 'identity' // Disable compression
    });

    let accumulatedContent = '';

    // Send initial message with ID
    res.write(`data: ${JSON.stringify({
      type: 'start',
      message_id: ai_message_id,
      timestamp: new Date().toISOString()
    })}\n\n`);

    // Clean up on client disconnect
    req.on('close', () => {
      console.log('Client disconnected from stream');
      const streamInfo = activeStreams.get(streamKey);
      if (streamInfo) {
        streamInfo.cancelled = true;
        activeStreams.delete(streamKey);
      }
    });

    try {
      // Check if stream was cancelled before starting
      const streamInfo = activeStreams.get(streamKey);
      if (streamInfo && streamInfo.cancelled) {
        res.end();
        return;
      }

      // Check for crisis first
      const isCrisis = geminiService.detectCrisis(userMessage);
      if (isCrisis) {
        const crisisResponse = geminiService.getCrisisResponse();
        
        res.write(`data: ${JSON.stringify({
          type: 'complete',
          message_id: ai_message_id,
          final_content: crisisResponse.content,
          saved: false,
          crisis_detected: true
        })}\n\n`);
        
        activeStreams.delete(streamKey);
        res.end();
        return;
      }

      // Get streaming response from Gemini
      const streamingResponse = await geminiService.generateStreamingResponse(
        userMessage, 
        conversation.ai_therapist_id || 'supportive',
        user_id,
        conversationId
      );

      // Stream the response chunks
      let chunkCount = 0;
      for await (const chunk of streamingResponse) {
        chunkCount++;
        console.log(`Processing chunk ${chunkCount}`);
        
        // Check if stream was cancelled
        const currentStreamInfo = activeStreams.get(streamKey);
        if (!currentStreamInfo || currentStreamInfo.cancelled) {
          console.log('Stream cancelled, stopping iteration');
          break;
        }

        try {
          const text = chunk.text();
          console.log(`Chunk ${chunkCount} text length:`, text?.length || 0);
          if (text) {
            accumulatedContent += text;
            
            res.write(`data: ${JSON.stringify({
              type: 'chunk',
              message_id: ai_message_id,
              content: text,
              accumulated_content: accumulatedContent
            })}\n\n`);
            
            // Force flush the response to ensure immediate delivery
            if (res.flush) res.flush();
          }
        } catch (chunkError) {
          console.error('Error processing chunk:', chunkError);
          // Continue with next chunk
        }
      }

      // Check if stream was cancelled before saving
      const finalStreamInfo = activeStreams.get(streamKey);
      if (finalStreamInfo && !finalStreamInfo.cancelled && accumulatedContent.trim()) {
        // Save the complete message to database
        const aiMessage = new Message({
          message_id: ai_message_id,
          conversation_id: conversationId,
          user_id,
          sender: 'ai',
          content: accumulatedContent,
          referenced_journal_entries: [] // Could be enhanced to include journal refs
        });

        await aiMessage.save();

        // Send completion signal
        res.write(`data: ${JSON.stringify({
          type: 'complete',
          message_id: ai_message_id,
          final_content: accumulatedContent,
          saved: true
        })}\n\n`);
      } else if (finalStreamInfo && finalStreamInfo.cancelled) {
        // Send cancellation signal
        res.write(`data: ${JSON.stringify({
          type: 'cancelled',
          message_id: ai_message_id,
          partial_content: accumulatedContent,
          saved: false
        })}\n\n`);
      }

    } catch (streamError) {
      console.error('Streaming error:', streamError);
      
      // Check if stream is still active before sending fallback
      const streamInfo = activeStreams.get(streamKey);
      if (streamInfo && !streamInfo.cancelled) {
        // Try fallback response
        const fallbackResponse = geminiService.getFallbackResponse(userMessage);
        accumulatedContent = fallbackResponse.content;
        
        res.write(`data: ${JSON.stringify({
          type: 'complete',
          message_id: ai_message_id,
          final_content: accumulatedContent,
          saved: false,
          fallback: true,
          error: 'Used fallback response'
        })}\n\n`);
      }
    }

    // Clean up
    activeStreams.delete(streamKey);
    res.end();

  } catch (error) {
    console.error('Stream setup error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Cancel an active stream
const cancelStream = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user_id = req.user.user_id;

    const streamKey = `${user_id}:${conversationId}`;
    const streamInfo = activeStreams.get(streamKey);

    if (!streamInfo) {
      return res.status(404).json({ 
        message: 'No active stream found for this conversation' 
      });
    }

    // Mark stream as cancelled
    streamInfo.cancelled = true;
    
    // Try to close the response if it's still writable
    if (streamInfo.response && !streamInfo.response.destroyed) {
      try {
        streamInfo.response.write(`data: ${JSON.stringify({
          type: 'cancelled',
          message_id: streamInfo.messageId,
          timestamp: new Date().toISOString()
        })}\n\n`);
        streamInfo.response.end();
      } catch (writeError) {
        console.error('Error writing cancellation to stream:', writeError);
      }
    }

    // Remove from active streams
    activeStreams.delete(streamKey);

    res.json({ 
      message: 'Stream cancelled successfully',
      message_id: streamInfo.messageId
    });

  } catch (error) {
    console.error('Cancel stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get active streams (for debugging/monitoring)
const getActiveStreams = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const userStreams = [];

    for (const [key, streamInfo] of activeStreams.entries()) {
      if (key.startsWith(`${user_id}:`)) {
        userStreams.push({
          conversation_id: key.split(':')[1],
          message_id: streamInfo.messageId,
          start_time: streamInfo.startTime,
          duration_ms: Date.now() - streamInfo.startTime.getTime()
        });
      }
    }

    res.json({ 
      active_streams: userStreams,
      total_active: userStreams.length
    });

  } catch (error) {
    console.error('Get active streams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createConversation,
  getConversations, 
  getConversation,
  sendMessage,
  streamAIResponse,
  cancelStream,
  getActiveStreams,
  deleteConversation,
  updateConversation,
  getAITypes
};
