import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, useSidebar } from "@/components/ui/sidebar";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  MoreHorizontal,
  Search,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { conversationAPI, type Conversation } from "@/services/api";

interface ChatSidebarProps {
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  selectedConversationId?: string;
  user: any;
  refreshTrigger?: number;
}

interface ConversationWithLastMessage
  extends Omit<Conversation, "last_message"> {
  last_message?: {
    content: string;
    sender: "user" | "ai";
    created_at: string;
  };
}

function ChatSidebarContent({
  onConversationSelect,
  onNewConversation,
  selectedConversationId,
  user,
  refreshTrigger,
}: ChatSidebarProps) {
  const [conversations, setConversations] = useState<
    ConversationWithLastMessage[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const { open } = useSidebar();

  // Fetch conversations on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchConversations();
  }, [refreshTrigger]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationAPI.getConversations(1, 50); // Get more conversations
      // Transform the conversations to match our interface
      const transformedConversations: ConversationWithLastMessage[] =
        response.conversations.map((conv) => ({
          ...conv,
          last_message:
            typeof conv.last_message === "string"
              ? undefined // Convert string to undefined for now
              : conv.last_message,
        }));
      // Filter out conversations without any messages
      const conversationsWithMessages = transformedConversations.filter(
        (conv) => conv.last_message || conv.last_message_at !== conv.created_at
      );
      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await conversationAPI.deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((conv) => conv.conversation_id !== conversationId)
      );
      // If deleting the selected conversation, trigger new conversation
      if (selectedConversationId === conversationId) {
        onNewConversation();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleRenameConversation = async (
    conversationId: string,
    newTitle: string
  ) => {
    try {
      await conversationAPI.updateConversation(conversationId, {
        title: newTitle,
      });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversation_id === conversationId
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

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.last_message?.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <TooltipProvider>
      <SidebarBody className="justify-between gap-4">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div className="space-y-4">
            {/* New Chat Button */}
            <Button
              onClick={onNewConversation}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${
                open ? "justify-start gap-2" : "justify-center p-2"
              }`}
            >
              <Plus className="h-4 w-4 shrink-0" />
              {open && <span className="truncate">New Chat</span>}
            </Button>

            {/* Search - only show when expanded */}
            {open && (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-1">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                {open && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Loading...
                  </p>
                )}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                {open && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm
                        ? "No conversations found"
                        : "No conversations yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start a new conversation to get started
                    </p>
                  </>
                )}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.conversation_id}
                  className={`group relative rounded-lg cursor-pointer transition-colors ${
                    open ? "p-3" : "p-2"
                  } ${
                    selectedConversationId === conversation.conversation_id
                      ? "bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() =>
                    onConversationSelect(conversation.conversation_id)
                  }
                >
                  <div
                    className={`flex items-start ${
                      open ? "justify-between" : "justify-center"
                    }`}
                  >
                    {!open ? (
                      // Collapsed view - show only icon with tooltip
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="max-w-xs">
                              {conversation.title ||
                                `Chat with ${conversation.ai_type || "AI"}`}
                            </p>
                            {conversation.last_message && (
                              <p className="text-xs opacity-75 mt-1">
                                {conversation.last_message.sender === "user"
                                  ? "You: "
                                  : "AI: "}
                                {truncateText(
                                  conversation.last_message.content,
                                  40
                                )}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      // Expanded view - show full content
                      <>
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
                            <h3 className="text-sm font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                              {conversation.title ||
                                `Chat with ${conversation.ai_type || "AI"}`}
                            </h3>
                          )}

                          {conversation.last_message && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {conversation.last_message.sender === "user"
                                ? "You: "
                                : "AI: "}
                              {truncateText(conversation.last_message.content)}
                            </p>
                          )}

                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(
                                conversation.last_message_at ||
                                  conversation.created_at
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {conversation.message_count || 0} messages
                            </span>
                          </div>
                        </div>

                        {/* Actions - only show when expanded */}
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
                                    `Chat with ${conversation.ai_type || "AI"}`
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
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Info - only show when expanded */}
        {open && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.first_name?.[0] || user?.username?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarBody>
    </TooltipProvider>
  );
}

export function ChatSidebar(props: ChatSidebarProps) {
  return (
    <Sidebar animate={true}>
      <ChatSidebarContent {...props} />
    </Sidebar>
  );
}
