import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { conversationAPI, type StreamChunk } from "@/services/api";
import { ChatSidebar } from "./chat-sidebar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  aiType?: string;
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

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedAI, setSelectedAI] = useState(AI_TYPES[0]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const triggerSidebarRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const createConversation = async (aiType: string): Promise<string | null> => {
    try {
      const response = await conversationAPI.createConversation({
        ai_type: aiType,
        journal_access_enabled: true,
      });
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
      // Trigger sidebar refresh after creating new conversation
      triggerSidebarRefresh();
    }
  };

  const handleConversationSelect = (convId: string) => {
    loadConversation(convId);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with a new conversation
    handleNewConversation();
  }, [selectedAI]);

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

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <ChatSidebar
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        selectedConversationId={conversationId || undefined}
        user={user}
        refreshTrigger={refreshTrigger}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center space-x-3">
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
    </div>
  );
}
