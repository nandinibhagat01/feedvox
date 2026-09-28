"use client";

import { use, useState } from "react";
import axios, { AxiosError } from "axios";
import { Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const Page = ({ params }: ProfilePageProps) => {
  const { username } = use(params);

  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Send anonymous message
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.add({
        title: "Message is empty",
        description: "Please write a message before sending.",
      });

      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post("/api/send-message", {
        username,
        title,
        content: message,
      });

      toast.add({
        title: "Message sent!",
        description: response.data.message,
      });

      setTitle("");
      setMessage("");
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
      }>;

      if (axiosError.response?.status === 403) {
        toast.add({
          title: "Messages are disabled",
          description:
            "This user is currently not accepting anonymous messages.",
        });

        return;
      }

      toast.add({
        title: "Error",
        description:
          axiosError.response?.data?.message ||
          "Failed to send anonymous message.",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Generate AI suggestions
  const handleSuggestMessages = async () => {
    setIsSuggesting(true);

    try {
      const response = await axios.post("/api/suggest-messages");

      console.log("Suggestions from API:", response.data);

      setSuggestions(response.data.suggestions || []);

      toast.add({
        title: "New suggestions generated",
        description: "Choose a message below to use it.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
      }>;

      toast.add({
        title: "Error",
        description:
          axiosError.response?.data?.message ||
          "Failed to generate suggestions.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  // Put suggestion into textarea
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6">
      {/* Background decoration */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Public profile */}
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-indigo-600">
            Public Profile Link
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Send anonymous message
          </h1>

          <p className="mt-2 text-gray-500">
            Send an anonymous message to{" "}
            <span className="font-semibold text-gray-900">@{username}</span>
          </p>
        </div>

        {/* Message Card */}
        <Card className="rounded-2xl border border-white/60 bg-white/80 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Send Anonymous Message
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter a title..."
              className="mb-3 rounded-xl"
            />

            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={`Write an anonymous message to @${username}...`}
              className="min-h-36 resize-none rounded-xl border-gray-200 bg-white/70 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
            />

            <Button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
              className="mt-4 w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 py-5 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Send className="mr-2 h-4 w-4" />

              {isSending ? "Sending..." : "Send Anonymous Message"}
            </Button>

            <Separator className="my-6 bg-indigo-100" />

            {/* Suggestions */}
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Need some inspiration?
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Click a message below to use it.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSuggestMessages}
                  disabled={isSuggesting}
                  className="rounded-xl border-indigo-200 bg-white hover:bg-indigo-50"
                >
                  <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />

                  {isSuggesting ? "Generating..." : "Suggest Messages"}
                </Button>
              </div>

              {/* Suggestions */}
              <div className="mt-4 space-y-3">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full rounded-xl border border-gray-200 bg-white/70 p-4 text-left text-sm text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {suggestion}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(
                          "What's a hobby you've recently started?",
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white/70 p-4 text-left text-sm text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      What's a hobby you've recently started?
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(
                          "What's something that always makes you smile?",
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white/70 p-4 text-left text-sm text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      What's something that always makes you smile?
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(
                          "If you could learn any new skill, what would it be?",
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white/70 p-4 text-left text-sm text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      If you could learn any new skill, what would it be?
                    </button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your message will be sent anonymously.
        </p>
      </div>
    </main>
  );
};

export default Page;
