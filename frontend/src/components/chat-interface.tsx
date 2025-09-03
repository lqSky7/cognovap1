import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Removed TypingAnimation import; using custom char-by-char animation
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
  // state for streaming animation
  const [streamingText, setStreamingText] = useState("");
  const [visibleLength, setVisibleLength] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Create conversation and add welcome message when AI type changes
    const initializeConversation = async () => {
      const newConversationId = await createConversation(selectedAI.id);
      setConversationId(newConversationId);

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hello! I'm your ${selectedAI.name}. ${selectedAI.description}. How can I help you today?`,
        sender: "ai",
        timestamp: new Date(),
        aiType: selectedAI.id,
      };
      setMessages([welcomeMessage]);
    };

    initializeConversation();
  }, [selectedAI]);

  // reset streaming state: clear queue and interval
  const resetStreaming = () => {
    setStreamingText("");
    setVisibleLength(0);
  };

  const handleSendMessage = async () => {
    // Before sending, reset any previous streaming
    // Before sending, reset previous streaming text
    setStreamingText("");
    if (!inputValue.trim() || isLoading || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    console.log("📤 Sending user message:", userMessage);
    setMessages((prev) => [...prev, userMessage]);
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
    console.log("🤖 Created AI message placeholder:", aiMessage);
    setMessages((prev) => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      abortControllerRef.current = new AbortController();
      await conversationAPI.streamMessage(
        conversationId!,
        inputValue,
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
          }
        },
        abortControllerRef.current.signal
      );
    } catch (error) {
      console.error("Stream error", error);
      resetStreaming();
      setIsStreaming(false);
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const handleCancelStream = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset streaming states
    setIsStreaming(false);
    setIsLoading(false);
    setStreamingMessageId(null);
    setStreamingText("");
    if (conversationId) {
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
    <div className="flex flex-col h-full max-w-4xl mx-auto">
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

        <Badge variant="secondary" className="text-xs">
          Online
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          console.log(`🎨 Rendering message:`, {
            id: message.id,
            sender: message.sender,
            content: message.content?.substring(0, 30) + "...",
            isStreamingMessage: message.id === streamingMessageId,
            isStreaming,
            streamingText: streamingText?.substring(0, 30) + "...",
          });

          return (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  {message.sender === "user" ? (
                    <>
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${user.email}`}
                      />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className={selectedAI.color}>
                      <selectedAI.icon className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  )}
                </Avatar>

                {message.sender === "user" ? (
                  <Card className="p-3 bg-primary text-primary-foreground">
                    <div className="text-sm">
                      <ReactMarkdown>{message.content || ""}</ReactMarkdown>
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </Card>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm text-foreground">
                      {message.id === streamingMessageId && isStreaming
                        ? streamingText.slice(0, visibleLength)
                        : message.content}
                    </div>
                    <div className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                )}
              </div>
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
