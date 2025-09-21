// Mock data for enhanced UI components

export interface User {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Message {
  message_id: string;
  conversation_id: string;
  sender: "user" | "ai";
  content: string;
  created_at: string;
  ai_type?: string;
}

export interface Conversation {
  conversation_id: string;
  user_id: string;
  ai_type: string;
  title: string;
  created_at: string;
  updated_at: string;
  journal_access_enabled: boolean;
  message_count: number;
  last_message: string;
  last_message_at: string;
  messages?: Message[];
}

export interface JournalEntry {
  entry_id: string;
  user_id: string;
  title: string;
  content: string;
  mood_score: number;
  tags: string[];
  entry_date: string;
  accessible_in_chat: boolean;
  created_at: string;
  attachment_placeholder?: string;
}

export interface AIType {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

export const user: User = {
  user_id: "user_123",
  username: "guest_user",
  email: "guest@cognova.ai",
  first_name: "Guest",
  last_name: "User",
  created_at: "2024-01-01T00:00:00Z"
};

export const conversations: Conversation[] = [
  {
    conversation_id: "conv_001",
    user_id: "user_123",
    ai_type: "empathetic_therapist",
    title: "Anxiety Support Session",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T11:15:00Z",
    journal_access_enabled: true,
    message_count: 12,
    last_message: "Thank you for sharing your feelings with me today.",
    last_message_at: "2024-01-15T11:15:00Z",
    messages: [
      {
        message_id: "msg_001",
        conversation_id: "conv_001",
        sender: "user",
        content: "I've been feeling really anxious lately about work.",
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        message_id: "msg_002",
        conversation_id: "conv_001",
        sender: "ai",
        content: "I understand that work-related anxiety can be overwhelming. Can you tell me more about what specifically at work is causing you to feel anxious?",
        created_at: "2024-01-15T10:31:00Z",
        ai_type: "empathetic_therapist"
      },
      {
        message_id: "msg_003",
        conversation_id: "conv_001",
        sender: "user",
        content: "It's mainly the upcoming presentation I have to give to the board. I keep thinking about all the ways it could go wrong.",
        created_at: "2024-01-15T10:35:00Z"
      },
      {
        message_id: "msg_004",
        conversation_id: "conv_001",
        sender: "ai",
        content: "It sounds like you're experiencing anticipatory anxiety about your presentation. This is very common. Let's work together on some strategies to help you feel more confident and prepared.",
        created_at: "2024-01-15T10:36:00Z",
        ai_type: "empathetic_therapist"
      }
    ]
  },
  {
    conversation_id: "conv_002",
    user_id: "user_123",
    ai_type: "mindfulness_coach",
    title: "Daily Mindfulness Practice",
    created_at: "2024-01-14T09:00:00Z",
    updated_at: "2024-01-14T09:30:00Z",
    journal_access_enabled: false,
    message_count: 8,
    last_message: "Try the 5-minute breathing exercise we discussed.",
    last_message_at: "2024-01-14T09:30:00Z",
    messages: [
      {
        message_id: "msg_005",
        conversation_id: "conv_002",
        sender: "user",
        content: "I want to start a daily mindfulness practice but I don't know where to begin.",
        created_at: "2024-01-14T09:00:00Z"
      },
      {
        message_id: "msg_006",
        conversation_id: "conv_002",
        sender: "ai",
        content: "That's wonderful! Starting a mindfulness practice is a great step for your well-being. Let's begin with something simple - a 5-minute daily breathing exercise. Would you like me to guide you through it?",
        created_at: "2024-01-14T09:01:00Z",
        ai_type: "mindfulness_coach"
      }
    ]
  },
  {
    conversation_id: "conv_003",
    user_id: "user_123",
    ai_type: "behavioral_specialist",
    title: "Sleep Routine Improvement",
    created_at: "2024-01-13T20:00:00Z",
    updated_at: "2024-01-13T20:45:00Z",
    journal_access_enabled: true,
    message_count: 15,
    last_message: "Remember to avoid screens 1 hour before bedtime.",
    last_message_at: "2024-01-13T20:45:00Z",
    messages: [
      {
        message_id: "msg_007",
        conversation_id: "conv_003",
        sender: "user",
        content: "I've been having trouble sleeping. I toss and turn for hours before falling asleep.",
        created_at: "2024-01-13T20:00:00Z"
      },
      {
        message_id: "msg_008",
        conversation_id: "conv_003",
        sender: "ai",
        content: "Sleep difficulties are very common and can significantly impact your well-being. Let's explore your current bedtime routine and identify some changes that might help improve your sleep quality.",
        created_at: "2024-01-13T20:01:00Z",
        ai_type: "behavioral_specialist"
      }
    ]
  }
];

export const journal_entries: JournalEntry[] = [
  {
    entry_id: "journal_001",
    user_id: "user_123",
    title: "Reflecting on Today's Anxiety",
    content: "Today was challenging. The anxiety about my upcoming presentation kept creeping in throughout the day. I noticed it most during lunch when I couldn't focus on my colleague's conversation. I tried the breathing technique my therapist suggested, and it helped a little. I'm grateful for having tools to cope, even when they don't completely eliminate the anxiety. Tomorrow I plan to practice my presentation with a friend to build more confidence.",
    mood_score: 6,
    tags: ["anxiety", "work", "presentation", "breathing-exercise", "gratitude"],
    entry_date: "2024-01-15",
    accessible_in_chat: true,
    created_at: "2024-01-15T22:30:00Z",
    attachment_placeholder: "/images/journal-placeholder-1.jpg"
  },
  {
    entry_id: "journal_002",
    user_id: "user_123",
    title: "Morning Mindfulness Victory",
    content: "I successfully completed my 5-minute morning meditation today! It's only the third day, but I'm already noticing small changes. My mind felt clearer during the first few hours of work, and I didn't immediately reach for my phone when I woke up. The guided breathing really helps anchor my attention. I want to gradually increase this to 10 minutes by next week.",
    mood_score: 8,
    tags: ["mindfulness", "meditation", "morning-routine", "progress", "clarity"],
    entry_date: "2024-01-14",
    accessible_in_chat: false,
    created_at: "2024-01-14T07:45:00Z",
    attachment_placeholder: "/images/journal-placeholder-2.jpg"
  },
  {
    entry_id: "journal_003",
    user_id: "user_123",
    title: "Sleep Experiment Results",
    content: "Following my therapist's advice, I tried avoiding screens for an hour before bed last night. It was harder than expected! I found myself reaching for my phone out of habit several times. Instead, I read a physical book and did some light stretching. I fell asleep faster than usual - maybe 20 minutes instead of my usual hour of tossing and turning. I want to continue this experiment for a full week to see if the pattern holds.",
    mood_score: 7,
    tags: ["sleep", "routine", "screens", "reading", "experiment", "progress"],
    entry_date: "2024-01-13",
    accessible_in_chat: true,
    created_at: "2024-01-13T21:15:00Z",
    attachment_placeholder: "/images/journal-placeholder-3.jpg"
  },
  {
    entry_id: "journal_004",
    user_id: "user_123",
    title: "Weekend Self-Care",
    content: "Spent the weekend focusing on self-care. Went for a long walk in the park, cooked a healthy meal, and had a video call with my sister. These simple activities felt really restorative. I realized I don't do enough of these nurturing activities during the week. I want to try scheduling one small self-care activity each weekday, even if it's just 15 minutes of something that brings me joy.",
    mood_score: 9,
    tags: ["self-care", "weekend", "walking", "cooking", "family", "restoration"],
    entry_date: "2024-01-12",
    accessible_in_chat: false,
    created_at: "2024-01-12T19:00:00Z",
    attachment_placeholder: "/images/journal-placeholder-4.jpg"
  }
];

export const ai_types: AIType[] = [
  {
    id: "empathetic_therapist",
    name: "Empathetic Therapist",
    description: "Warm, understanding, and focused on emotional support",
    avatar: "🤗"
  },
  {
    id: "mindfulness_coach",
    name: "Mindfulness Coach",
    description: "Guides meditation and mindfulness practices",
    avatar: "🧘"
  },
  {
    id: "behavioral_specialist",
    name: "Behavioral Specialist",
    description: "Focuses on changing habits and behaviors",
    avatar: "🎯"
  },
  {
    id: "solution_focused",
    name: "Solution-Focused Therapist",
    description: "Practical, goal-oriented approach to problem-solving",
    avatar: "💡"
  },
  {
    id: "trauma_specialist",
    name: "Trauma Specialist",
    description: "Specialized in trauma-informed care and PTSD support",
    avatar: "🛡️"
  }
];