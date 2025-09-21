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
  DialogTrigger,
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
} from "lucide-react";

interface JournalEntry {
  entry_id: string;
  title: string;
  content: string;
  mood_score: number;
  tags: string[];
  entry_date: string;
  accessible_in_chat: boolean;
  created_at: string;
}

interface JournalProps {
  user: any;
}

export function Journal({ user: _user }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood_score: 5,
    tags: "",
    accessible_in_chat: true,
  });

  // Mock data for demo
  useEffect(() => {
    const mockEntries: JournalEntry[] = [
      {
        entry_id: "1",
        title: "A Great Day!",
        content:
          "Today was amazing! I felt really productive and accomplished a lot of my goals. The weather was beautiful and I had a great conversation with a friend. I'm feeling grateful for all the positive things in my life right now.",
        mood_score: 8,
        tags: ["grateful", "productive", "happy"],
        entry_date: "2025-09-02",
        accessible_in_chat: true,
        created_at: "2025-09-02T10:00:00Z",
      },
      {
        entry_id: "2",
        title: "Reflecting on Growth",
        content:
          "I've been thinking about how much I've grown over the past year. There have been challenges, but each one has taught me something valuable. I'm learning to be more patient with myself and to celebrate small victories.",
        mood_score: 7,
        tags: ["growth", "reflection", "self-compassion"],
        entry_date: "2025-09-01",
        accessible_in_chat: true,
        created_at: "2025-09-01T15:30:00Z",
      },
      {
        entry_id: "3",
        title: "Feeling Overwhelmed",
        content:
          "Work has been really stressful lately and I'm feeling a bit overwhelmed. I know this is temporary, but it's hard to see the light at the end of the tunnel sometimes. I need to remember to take breaks and practice self-care.",
        mood_score: 4,
        tags: ["stressed", "overwhelmed", "work"],
        entry_date: "2025-08-31",
        accessible_in_chat: false,
        created_at: "2025-08-31T20:00:00Z",
      },
    ];
    setEntries(mockEntries);
  }, []);

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const entry: JournalEntry = {
      entry_id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood_score: newEntry.mood_score,
      tags: newEntry.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      entry_date: new Date().toISOString().split("T")[0],
      accessible_in_chat: newEntry.accessible_in_chat,
      created_at: new Date().toISOString(),
    };

    setEntries((prev) => [entry, ...prev]);
    setNewEntry({
      title: "",
      content: "",
      mood_score: 5,
      tags: "",
      accessible_in_chat: true,
    });
    setIsCreateDialogOpen(false);
    setIsLoading(false);
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Journal
          </h1>
          <p className="text-muted-foreground mt-2">
            Document your thoughts, feelings, and experiences
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <RainbowButton>
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </RainbowButton>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newEntry.title}
                  onChange={(e) =>
                    setNewEntry((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Give your entry a title..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newEntry.content}
                  onChange={(e) =>
                    setNewEntry((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Write about your day, thoughts, or feelings..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mood">Mood Score (1-10)</Label>
                  <Input
                    id="mood"
                    type="number"
                    min="1"
                    max="10"
                    value={newEntry.mood_score}
                    onChange={(e) =>
                      setNewEntry((prev) => ({
                        ...prev,
                        mood_score: parseInt(e.target.value) || 5,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newEntry.tags}
                    onChange={(e) =>
                      setNewEntry((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="happy, productive, grateful"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="accessible"
                  checked={newEntry.accessible_in_chat}
                  onChange={(e) =>
                    setNewEntry((prev) => ({
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

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateEntry} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Entry
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Entries Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, index) => (
          <BlurFade key={entry.entry_id} delay={0.1 * index} inView>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {entry.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(entry.entry_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getMoodIcon(entry.mood_score)}
                    <Badge className={getMoodColor(entry.mood_score)}>
                      {entry.mood_score}/10
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
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
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
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
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

      {entries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
          <p className="text-muted-foreground mb-4">
            Start your journaling journey by creating your first entry
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Entry
          </Button>
        </div>
      )}
    </div>
  );
}
