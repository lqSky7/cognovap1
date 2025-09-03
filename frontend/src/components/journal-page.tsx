import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import {
  Plus,
  Calendar,
  Heart,
  BookOpen,
  Edit,
  Trash2,
  Save,
  Smile,
  Meh,
  Frown,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { journalAPI, type JournalEntry, type User } from "@/services/api";

interface JournalPageProps {
  user: User;
}

type ViewMode = "list" | "create" | "edit" | "view";

export function JournalPage({ user: _user }: JournalPageProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<string | null>(
    null
  );

  // Form state for creating/editing entries
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood_score: 5,
    tags: "",
    accessible_in_chat: true,
  });

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMoodMin, setFilterMoodMin] = useState("");
  const [filterMoodMax, setFilterMoodMax] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Load journal entries
  const loadEntries = async () => {
    try {
      setIsLoadingEntries(true);
      const filters: any = {};

      if (filterMoodMin) filters.mood_min = parseInt(filterMoodMin);
      if (filterMoodMax) filters.mood_max = parseInt(filterMoodMax);
      if (filterTag) filters.tag = filterTag;

      const response = await journalAPI.getEntries({ limit: 50, ...filters });
      setEntries(response.entries);
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [filterMoodMin, filterMoodMax, filterTag]);

  // Create new entry
  const handleCreateEntry = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsLoading(true);
    try {
      const entryData = {
        title: formData.title,
        content: formData.content,
        mood_score: formData.mood_score,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        accessible_in_chat: formData.accessible_in_chat,
      };

      const response = await journalAPI.createEntry(entryData);
      setEntries((prev) => [response.entry, ...prev]);

      // Reset form and go back to list
      resetForm();
      setCurrentView("list");
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update entry
  const handleUpdateEntry = async () => {
    if (!selectedEntry || !formData.title.trim() || !formData.content.trim())
      return;

    setIsLoading(true);
    try {
      const updateData = {
        title: formData.title,
        content: formData.content,
        mood_score: formData.mood_score,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        accessible_in_chat: formData.accessible_in_chat,
      };

      const response = await journalAPI.updateEntry(
        selectedEntry.entry_id,
        updateData
      );

      // Update entries list
      setEntries((prev) =>
        prev.map((entry) =>
          entry.entry_id === selectedEntry.entry_id ? response.entry : entry
        )
      );

      // Reset and go back to list
      resetForm();
      setSelectedEntry(null);
      setCurrentView("list");
    } catch (error) {
      console.error("Error updating entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete entry
  const handleDeleteEntry = async (entryId: string) => {
    try {
      await journalAPI.deleteEntry(entryId);
      setEntries((prev) => prev.filter((entry) => entry.entry_id !== entryId));
      setDeleteConfirmDialog(null);

      // If we're viewing the deleted entry, go back to list
      if (selectedEntry?.entry_id === entryId) {
        setCurrentView("list");
        setSelectedEntry(null);
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      mood_score: 5,
      tags: "",
      accessible_in_chat: true,
    });
  };

  const startEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setFormData({
      title: entry.title || "",
      content: entry.content,
      mood_score: entry.mood_score || 5,
      tags: entry.tags.join(", "),
      accessible_in_chat: entry.accessible_in_chat,
    });
    setCurrentView("edit");
  };

  const viewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setCurrentView("view");
  };

  const getMoodIcon = (score: number) => {
    if (score >= 7) return <Smile className="w-4 h-4 text-green-500" />;
    if (score >= 4) return <Meh className="w-4 h-4 text-yellow-500" />;
    return <Frown className="w-4 h-4 text-red-500" />;
  };

  const getMoodColor = (score: number) => {
    if (score >= 7) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Filter entries based on search term
  const filteredEntries = entries.filter((entry) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.title?.toLowerCase().includes(searchLower) ||
      entry.content.toLowerCase().includes(searchLower) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  // Render different views
  const renderHeader = () => {
    switch (currentView) {
      case "create":
        return (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetForm();
                  setCurrentView("list");
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create New Entry
                </h1>
                <p className="text-muted-foreground mt-1">
                  Document your thoughts, feelings, and experiences
                </p>
              </div>
            </div>
          </div>
        );
      case "edit":
        return (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetForm();
                  setSelectedEntry(null);
                  setCurrentView("list");
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Edit Entry
                </h1>
                <p className="text-muted-foreground mt-1">
                  Update your journal entry
                </p>
              </div>
            </div>
          </div>
        );
      case "view":
        return (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedEntry(null);
                  setCurrentView("list");
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {selectedEntry?.title || "View Entry"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {selectedEntry?.entry_date &&
                    new Date(selectedEntry.entry_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedEntry && startEdit(selectedEntry)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  selectedEntry &&
                  setDeleteConfirmDialog(selectedEntry.entry_id)
                }
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Journal
                </h1>
                <p className="text-muted-foreground mt-2">
                  Document your thoughts, feelings, and experiences
                </p>
              </div>
              <RainbowButton onClick={() => setCurrentView("create")}>
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </RainbowButton>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <Card className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mood-min">Min Mood</Label>
                    <Input
                      id="mood-min"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1"
                      value={filterMoodMin}
                      onChange={(e) => setFilterMoodMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mood-max">Max Mood</Label>
                    <Input
                      id="mood-max"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="10"
                      value={filterMoodMax}
                      onChange={(e) => setFilterMoodMax(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="filter-tag">Tag</Label>
                    <Input
                      id="filter-tag"
                      placeholder="happy, productive..."
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterMoodMin("");
                      setFilterMoodMax("");
                      setFilterTag("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        );
    }
  };

  const renderForm = () => (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Give your entry a title..."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Write about your day, thoughts, or feelings..."
                className="min-h-[300px] mt-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="mood">Mood Score (1-10)</Label>
                <Input
                  id="mood"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.mood_score}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mood_score: parseInt(e.target.value) || 5,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="happy, productive, grateful"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="accessible"
                checked={formData.accessible_in_chat}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    accessible_in_chat: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <Label htmlFor="accessible" className="text-sm">
                Allow AI to reference this entry in conversations
              </Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setSelectedEntry(null);
                  setCurrentView("list");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  currentView === "create"
                    ? handleCreateEntry
                    : handleUpdateEntry
                }
                disabled={
                  isLoading ||
                  !formData.title.trim() ||
                  !formData.content.trim()
                }
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {currentView === "create" ? "Create Entry" : "Update Entry"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEntryView = () => (
    <div className="max-w-4xl mx-auto">
      {selectedEntry && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {selectedEntry.title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedEntry.entry_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getMoodIcon(selectedEntry.mood_score || 5)}
                    <Badge
                      className={getMoodColor(selectedEntry.mood_score || 5)}
                    >
                      {selectedEntry.mood_score || 5}/10
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-foreground whitespace-pre-wrap mb-6">
                {selectedEntry.content}
              </p>
            </div>

            {selectedEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEntry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {selectedEntry.accessible_in_chat ? (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Available to AI in conversations</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  <span>Private entry</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderEntriesList = () => (
    <div>
      {isLoadingEntries ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm || filterMoodMin || filterMoodMax || filterTag
              ? "No entries match your search"
              : "No entries yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterMoodMin || filterMoodMax || filterTag
              ? "Try adjusting your search or filters"
              : "Start your journaling journey by creating your first entry"}
          </p>
          <Button onClick={() => setCurrentView("create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Entry
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry, index) => (
            <BlurFade key={entry.entry_id} delay={0.1 * index} inView>
              <Card
                className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => viewEntry(entry)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {entry.title || "Untitled"}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getMoodIcon(entry.mood_score || 5)}
                      <Badge className={getMoodColor(entry.mood_score || 5)}>
                        {entry.mood_score || 5}/10
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <BoxReveal boxColor="#a855f7" duration={0.5}>
                    <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                      {entry.content}
                    </p>
                  </BoxReveal>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{entry.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {entry.accessible_in_chat ? (
                        <>
                          <BookOpen className="w-3 h-3" />
                          <span>AI Accessible</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-3 h-3" />
                          <span>Private</span>
                        </>
                      )}
                    </div>

                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(entry);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmDialog(entry.entry_id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {renderHeader()}

      {/* Main Content */}
      {currentView === "list" && renderEntriesList()}
      {(currentView === "create" || currentView === "edit") && renderForm()}
      {currentView === "view" && renderEntryView()}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmDialog}
        onOpenChange={() => setDeleteConfirmDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this journal entry? This action
              cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmDialog(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmDialog && handleDeleteEntry(deleteConfirmDialog)
              }
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
