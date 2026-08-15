"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Conversation,
  deleteAllMoyoData,
  getConversations,
} from "@/lib/moyo-storage";

export default function HistoryPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    setConversations(getConversations());
  }, []);

  function deleteData() {
    deleteAllMoyoData();
    setConversations([]);
    setShowDelete(false);
  }

  return (
    <main className="min-h-[100dvh] bg-[#faf9f7] text-[#151515]">
      <div className="mx-auto min-h-[100dvh] max-w-2xl px-5 sm:px-8">

        <header className="flex items-center justify-between py-5">
          <button
            onClick={() => router.push("/chat")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-lg font-extrabold tracking-[-0.05em]">
            Your conversations
          </h1>

          <div className="w-11" />
        </header>

        <section className="pb-10 pt-8">
          <p className="text-sm leading-6 text-neutral-500">
            Your conversations are stored on this device. You decide
            when they should be removed.
          </p>

          <div className="mt-8 space-y-2">
            {conversations.length === 0 ? (
              <div className="rounded-[2rem] bg-white px-6 py-12 text-center shadow-sm">
                <p className="font-bold">Nothing here yet.</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Your conversations will appear here.
                </p>
              </div>
            ) : (
              conversations
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((conversation) => (
                  <button
                    key={conversation.id}
                    className="flex w-full items-center justify-between rounded-[1.5rem] bg-white p-5 text-left shadow-sm transition hover:scale-[1.01]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {conversation.title}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        {conversation.messages.length} messages
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-neutral-400"
                    />
                  </button>
                ))
            )}
          </div>
        </section>

        {/* Privacy */}
        <section className="border-t border-neutral-200 py-8">
          <p className="text-sm font-extrabold">
            Your data, your choice.
          </p>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            MOYO doesn't require an account for this experience.
            Your local conversation history can be permanently
            deleted from this device at any time.
          </p>

          <button
            onClick={() => setShowDelete(true)}
            className="mt-5 flex items-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-600"
          >
            <Trash2 size={16} />
            Delete my data
          </button>
        </section>

        {/* Confirmation */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em]">
                Delete everything?
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                This permanently removes MOYO's locally stored
                conversations and goals from this device.
                This cannot be undone.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 rounded-full bg-neutral-100 px-5 py-3.5 text-sm font-bold"
                >
                  Keep data
                </button>

                <button
                  onClick={deleteData}
                  className="flex-1 rounded-full bg-red-600 px-5 py-3.5 text-sm font-bold text-white"
                >
                  Delete everything
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
