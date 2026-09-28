"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Message } from "@/src/model/User";
import { acceptMessagesSchema } from "@/src/schemas/acceptMessageSchema";
import { ApiResponse } from "@/src/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id?.toString() !== messageId),
    );
  };
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage ?? true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.add({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.add({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      (setValue("acceptMessages", !acceptMessages),
        toast.add({
          title: response.data.message,
        }));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to update message settings",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-sm font-medium text-gray-500">Please Login</p>
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.add({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Profile URL Card */}
        <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-gray-900">
            Your unique link
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Share this link with others to receive anonymous messages.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="h-11 flex-1 rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-sm text-gray-600 outline-none"
            />

            <Button
              onClick={copyToClipboard}
              className="h-11 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-6 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              Copy Link
            </Button>
          </div>
        </div>

        {/* Message Settings */}
        <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Message Settings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Control whether people can send you anonymous messages.
              </p>
            </div>

            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                acceptMessages ? "bg-green-500" : "bg-gray-400"
              }`}
            />

            <span className="text-sm font-medium text-gray-600">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
        </div>

        <Separator className="my-8 bg-indigo-100" />

        {/* Messages Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Your Messages
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Messages you have received anonymously.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={isLoading}
            className="h-10 rounded-xl border-gray-200 bg-white/80 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}

            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Messages */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id?.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-white/60 bg-white/80 p-10 text-center shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-gray-900">
                No messages yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Share your unique link to start receiving anonymous messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default dashboard;
