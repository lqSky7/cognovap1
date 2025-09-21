import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  User,
  ChevronDown,
  StopCircle,
  Loader2,
  Brain,
  Heart,
  Lightbulb,
  Palette,
  BookOpen,
  Search,
  MessageSquare,
  Plus,
  ArrowLeft,
  Clock,
  Trash2,
  Edit3,
  MoreHorizontal,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { conversationAPI, type StreamChunk, type Conversation } from "@/services/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  aiType?: string;
}

interface ConversationWithLastMessage extends Omit<Conversation, "last_message"> {
  last_message?: {
    content: string;
    sender: "user" | "ai";
    created_at: string;
  };
}

interface ChatInterfaceProps {
  user: any;
}

const AI_TYPES = [
  {
    id: "supportive",
    name: "Supportive AI",
    description: "A caring and encouraging AI therapist",
    icon: Heart,
    color: "bg-pink-500",
  },
  {
    id: "analytical",
    name: "Analytical AI",
    description: "A logical and structured AI therapist",
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    id: "creative",
    name: "Creative AI",
    description: "A creative and expressive AI therapist",
    icon: Palette,
    color: "bg-purple-500",
  },
  {
    id: "jung",
    name: "Jungian AI",
    description: "An AI based on Carl Jung's analytical psychology",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    id: "cbt",
    name: "CBT AI",
    description: "An AI specializing in Cognitive Behavioral Therapy",
    icon: Lightbulb,
    color: "bg-yellow-500",
  },
];

export function ChatInterface({ user: _ }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedAI, setSelectedAI] = useState(AI_TYPES[0]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // New states for full-screen chat list
  const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ConversationWithLastMessage[]>([]);
  const [showChatList, setShowChatList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [conversationsLoading, setConversationsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const triggerSidebarRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setConversationsLoading(true);
      const response = await conversationAPI.getConversations(1, 100); // Get more conversations
      const transformedConversations: ConversationWithLastMessage[] =
        response.conversations.map((conv) => ({
          ...conv,
          last_message:
            typeof conv.last_message === "string"
              ? undefined
              : conv.last_message,
        }));
      setConversations(transformedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setConversationsLoading(false);
    }
  };

  // Dual search: frontend + backend
  const performSearch = useMemo(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // Frontend search first
    const frontendResults = conversations.filter(
      (conv) =>
        conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.last_message?.content
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conv.ai_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(frontendResults);

    // TODO: If frontend results are insufficient, query backend
    // This would require implementing a search endpoint in the API
    // For now, we'll use frontend-only search as the API doesn't have search endpoint
  }, [searchTerm, conversations]);

  useEffect(() => {
    performSearch;
  }, [performSearch]);

  // Load conversations on mount and refresh
  useEffect(() => {
    fetchConversations();
  }, [refreshTrigger]);

  const createConversation = async (aiType: string): Promise<string | null> => {
    try {
      const response = await conversationAPI.createConversation({
        ai_type: aiType,
        journal_access_enabled: true,
      });
      triggerSidebarRefresh();
      return response.conversation.conversation_id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  };

  const loadConversation = async (convId: string) => {
    try {
      setIsLoading(true);
      const response = await conversationAPI.getConversation(convId);

      // Convert API messages to our Message interface
      const convertedMessages: Message[] = response.messages.map((msg) => ({
        id: msg.message_id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.created_at),
        aiType: msg.ai_type,
      }));

      setMessages(convertedMessages);
      setConversationId(convId);
      setShowChatList(false); // Hide chat list when conversation is loaded
      
      // Set the AI type based on the conversation
      const conversation = conversations.find(c => c.conversation_id === convId);
      if (conversation) {
        const aiType = AI_TYPES.find(ai => ai.id === conversation.ai_type);
        if (aiType) {
          setSelectedAI(aiType);
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async () => {
    const newConversationId = await createConversation(selectedAI.id);
    if (newConversationId) {
      setConversationId(newConversationId);
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hello! I'm your ${selectedAI.name}. ${selectedAI.description}. How can I help you today?`,
        sender: "ai",
        timestamp: new Date(),
        aiType: selectedAI.id,
      };
      setMessages([welcomeMessage]);
      setShowChatList(false);
      triggerSidebarRefresh();
    }
  };

  const handleConversationSelect = (convId: string) => {
    loadConversation(convId);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setConversationId(null);
    setMessages([]);
  };

  const handleDeleteConversation = async (conversationIdToDelete: string) => {
    try {
      await conversationAPI.deleteConversation(conversationIdToDelete);
      setConversations((prev) =>
        prev.filter((conv) => conv.conversation_id !== conversationIdToDelete)
      );
      if (conversationId === conversationIdToDelete) {
        handleBackToList();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleRenameConversation = async (
    conversationIdToRename: string,
    newTitle: string
  ) => {
    try {
      await conversationAPI.updateConversation(conversationIdToRename, {
        title: newTitle,
      });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversation_id === conversationIdToRename
            ? { ...conv, title: newTitle }
            : conv
        )
      );
      setEditingId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error renaming conversation:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetStreaming = () => {
    setStreamingText("");
  };

  const handleSendMessage = async () => {
    setStreamingText("");
    if (!inputValue.trim() || isLoading || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue("");
    setIsLoading(true);
    setIsStreaming(true);

    // Create AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      sender: "ai",
      timestamp: new Date(),
      aiType: selectedAI.id,
    };
    setMessages((prev) => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      abortControllerRef.current = new AbortController();
      await conversationAPI.streamMessage(
        conversationId!,
        messageContent,
        (chunk: StreamChunk) => {
          if (chunk.type === "chunk" && chunk.accumulated_content) {
            setStreamingText(chunk.accumulated_content);
          } else if (chunk.type === "complete") {
            const finalContent =
              chunk.final_content || chunk.accumulated_content || streamingText;
            setStreamingText(finalContent);
            // On completion, finalize message and reset states
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId ? { ...msg, content: finalContent } : msg
              )
            );
            setIsStreaming(false);
            setIsLoading(false);
            setStreamingMessageId(null);
            // Trigger sidebar refresh after message is complete
            triggerSidebarRefresh();
          }
        },
        abortControllerRef.current.signal
      );
    } catch (error) {
      console.error("Stream error", error);
      resetStreaming();
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessageId(null);
      // Remove the placeholder message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
    }
  };

  const handleCancelStream = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (conversationId && isStreaming) {
      try {
        await conversationAPI.cancelStream(conversationId);
      } catch (error) {
        console.error("Error cancelling stream:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const displayConversations = searchTerm.trim() ? searchResults : conversations;

  // Full-screen chat list view
  if (showChatList) {
    return (
      <div className="flex flex-col h-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-background/95 backdrop-blur">
          <div>
            <h1 className="text-2xl font-bold">Your Conversations</h1>
            <p className="text-muted-foreground">
              Chat with AI therapists to support your mental health journey
            </p>
          </div>
          <Button
            onClick={handleNewConversation}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              {displayConversations.length} conversations found
            </p>
          )}
        </div>

        {/* Conversations Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {conversationsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-muted-foreground ml-3">Loading conversations...</p>
            </div>
          ) : displayConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm
                  ? "No conversations found"
                  : "No conversations yet"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Start a new conversation to get started"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleNewConversation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start Your First Chat
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayConversations.map((conversation) => {
                const aiType = AI_TYPES.find(ai => ai.id === conversation.ai_type) || AI_TYPES[0];
                
                return (
                  <Card
                    key={conversation.conversation_id}
                    className="p-4 cursor-pointer transition-colors hover:bg-accent group"
                    onClick={() => handleConversationSelect(conversation.conversation_id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${aiType.color} flex items-center justify-center`}>
                          <aiType.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingId === conversation.conversation_id ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() =>
                                handleRenameConversation(
                                  conversation.conversation_id,
                                  editTitle
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleRenameConversation(
                                    conversation.conversation_id,
                                    editTitle
                                  );
                                } else if (e.key === "Escape") {
                                  setEditingId(null);
                                  setEditTitle("");
                                }
                              }}
                              className="text-sm font-medium h-6 p-1"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <h3 className="font-medium truncate">
                              {conversation.title ||
                                `Chat with ${aiType.name}`}
                            </h3>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {aiType.name}
                          </p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(conversation.conversation_id);
                              setEditTitle(
                                conversation.title ||
                                  `Chat with ${aiType.name}`
                              );
                            }}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                confirm(
                                  "Are you sure you want to delete this conversation?"
                                )
                              ) {
                                handleDeleteConversation(
                                  conversation.conversation_id
                                );
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {conversation.last_message && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-xs font-medium">
                            {conversation.last_message.sender === "user" ? "You: " : "AI: "}
                          </span>
                          {truncateText(conversation.last_message.content, 120)}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTime(
                            conversation.last_message_at ||
                              conversation.created_at
                          )}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {conversation.message_count || 0} messages
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat view (when a conversation is selected)
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div
            className={`w-10 h-10 rounded-full ${selectedAI.color} flex items-center justify-center`}
          >
            <selectedAI.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto font-normal">
                  <div className="text-left">
                    <div className="font-semibold flex items-center">
                      {selectedAI.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedAI.description}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {AI_TYPES.map((ai) => (
                  <DropdownMenuItem
                    key={ai.id}
                    onClick={() => setSelectedAI(ai)}
                    className="flex items-start space-x-3 p-3"
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${ai.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <ai.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{ai.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {ai.description}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Badge variant="secondary" className="ml-4">
          Chat Active
        </Badge>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isStreamingMessage = streamingMessageId === message.id;
          let displayContent = message.content;

          if (isStreamingMessage && streamingText) {
            displayContent = streamingText;
          }

          return (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } space-x-3`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={selectedAI.color}>
                    <selectedAI.icon className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : "bg-muted"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{displayContent}</ReactMarkdown>
                    {isStreamingMessage && isStreaming && (
                      <span className="animate-pulse">▊</span>
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{displayContent}</div>
                )}
                {!isStreamingMessage && (
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                )}
              </div>
              {message.sender === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            {isStreaming && (
              <Button
                onClick={handleCancelStream}
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0"
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-9 w-9 p-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
