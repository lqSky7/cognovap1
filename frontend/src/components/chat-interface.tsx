import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { TypingAnimation } from "@/components/magicui/typing-animation"
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
  BookOpen
} from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  aiType?: string
}

interface ChatInterfaceProps {
  user: any
}

const AI_TYPES = [
  { 
    id: "supportive", 
    name: "Supportive AI", 
    description: "A caring and encouraging AI therapist",
    icon: Heart,
    color: "bg-pink-500"
  },
  { 
    id: "analytical", 
    name: "Analytical AI", 
    description: "A logical and structured AI therapist",
    icon: Brain,
    color: "bg-blue-500"
  },
  { 
    id: "creative", 
    name: "Creative AI", 
    description: "A creative and expressive AI therapist",
    icon: Palette,
    color: "bg-purple-500"
  },
  { 
    id: "jung", 
    name: "Jungian AI", 
    description: "An AI based on Carl Jung's analytical psychology",
    icon: BookOpen,
    color: "bg-green-500"
  },
  { 
    id: "cbt", 
    name: "CBT AI", 
    description: "An AI specializing in Cognitive Behavioral Therapy",
    icon: Lightbulb,
    color: "bg-yellow-500"
  }
]

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedAI, setSelectedAI] = useState(AI_TYPES[0])
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message when AI type changes
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello! I'm your ${selectedAI.name}. ${selectedAI.description}. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
      aiType: selectedAI.id
    }
    setMessages([welcomeMessage])
  }, [selectedAI])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setIsStreaming(true)

    // Create AI message placeholder
    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      sender: 'ai',
      timestamp: new Date(),
      aiType: selectedAI.id
    }
    setMessages(prev => [...prev, aiMessage])
    setStreamingMessageId(aiMessageId)

    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

      // Simulate streaming response (replace with actual API call)
      const response = await simulateStreamingResponse(inputValue, selectedAI.id, abortControllerRef.current.signal)
      
      // Update the AI message with the full response
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: response }
          : msg
      ))
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Handle cancellation
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: "Response cancelled." }
            : msg
        ))
      } else {
        console.error('Chat error:', error)
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: "Sorry, I encountered an error. Please try again." }
            : msg
        ))
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setStreamingMessageId(null)
      abortControllerRef.current = null
    }
  }

  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${selectedAI.color} flex items-center justify-center`}>
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
                    <div className="text-sm text-muted-foreground">{selectedAI.description}</div>
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
                    <div className={`w-8 h-8 rounded-full ${ai.color} flex items-center justify-center flex-shrink-0`}>
                      <ai.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{ai.name}</div>
                      <div className="text-sm text-muted-foreground">{ai.description}</div>
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <Avatar className="w-8 h-8">
                {message.sender === 'user' ? (
                  <>
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
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
              
              <Card className={`p-3 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {message.sender === 'ai' && message.id === streamingMessageId && isStreaming ? (
                  <TypingAnimation className="text-sm">
                    {message.content || "Thinking..."}
                  </TypingAnimation>
                ) : (
                  <div className="text-sm">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Card>
            </div>
          </div>
        ))}
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
  )
}

// Simulate streaming response - replace with actual API call
async function simulateStreamingResponse(_message: string, aiType: string, signal: AbortSignal): Promise<string> {
  const responses = {
    supportive: `I hear you, and I want you to know that your feelings are completely valid. It takes courage to share what's on your mind. From what you've told me, it sounds like you're going through something challenging right now.

Remember that it's okay to feel overwhelmed sometimes - we all do. What's important is that you're reaching out and taking steps to process these feelings. You're stronger than you realize.

Would you like to explore these feelings a bit more? Sometimes talking through our thoughts can help us gain clarity and find ways to move forward. I'm here to support you every step of the way. 💙`,
    
    analytical: `Thank you for sharing that with me. Let me help you break this down systematically.

Based on what you've described, I can identify several key components:
1. The immediate situation or trigger
2. Your emotional response
3. The underlying thoughts or beliefs
4. Potential action steps

This structured approach can help us understand the patterns in your thinking and develop effective strategies for managing similar situations in the future.

Would you like to examine any of these components more closely? Understanding the "why" behind our reactions often provides the clearest path to positive change.`,
    
    creative: `What you've shared paints a vivid picture in my mind - like a garden where some flowers are blooming while others struggle to find sunlight. Your experience reminds me of a river that encounters rocks along its path; the water doesn't stop flowing, it simply finds new ways around the obstacles.

Sometimes our emotions are like colors on an artist's palette - they might seem overwhelming when mixed together, but each one serves a purpose in creating the complete picture of who we are.

Your story has layers, like a beautiful piece of music with different melodies weaving together. What melody would you like to focus on first? Let's explore this creative landscape of your inner world together. 🎨✨`,
    
    jung: `What you've shared connects to some profound archetypal patterns that Jung identified in the human psyche. The situation you're describing may be touching on some deep, universal themes that resonate across cultures and time.

Consider this: might there be a part of you - what Jung called the "shadow" - that's trying to communicate something important? Sometimes our struggles contain wisdom that our conscious mind hasn't yet recognized.

The individuation process - becoming who we truly are - often involves integrating these different aspects of ourselves. Your dreams, emotions, and reactions all contain valuable information about your psychological development.

What symbols or recurring themes have you noticed in your life lately? Often, the psyche speaks to us through metaphor and symbol. 🌟`,
    
    cbt: `I appreciate you sharing this with me. Let's examine this situation using some cognitive-behavioral techniques that can help identify and modify unhelpful thought patterns.

First, let's identify the specific thoughts that were going through your mind during this situation. Often, our emotional responses are directly connected to our interpretations of events, rather than the events themselves.

Some questions to consider:
- What evidence supports or contradicts these thoughts?
- Are you using any cognitive distortions (like all-or-nothing thinking, catastrophizing, or mind reading)?
- What would you tell a good friend in this same situation?

By examining our thought patterns, we can develop more balanced and helpful ways of interpreting situations. This often leads to feeling better and making more effective choices.

Would you like to work through identifying some of these thought patterns together? 🧠`
  }

  // Simulate delay and check for cancellation
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 1000 + Math.random() * 2000) // 1-3 seconds
    signal.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(new Error('AbortError'))
    })
  })

  return responses[aiType as keyof typeof responses] || responses.supportive
}
