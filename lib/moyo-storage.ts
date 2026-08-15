export type StoredMessage = {
  from: "user" | "moyo";
  text: string;
  timestamp: number;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
};

const STORAGE_KEY = "moyo-conversations";

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(conversations)
  );
}

export function deleteAllMoyoData() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("moyo-goals");
}

export function createConversation(): Conversation {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}
