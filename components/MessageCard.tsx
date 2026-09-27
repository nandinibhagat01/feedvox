"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/src/model/User";
import axios from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { toast } from "./ui/toast";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id.toString()}`,
      );

      toast.add({
        title: response.data.message,
      });

      onMessageDelete(message._id.toString());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("DELETE ERROR:", error.response?.data);
        console.log("STATUS:", error.response?.status);
      } else {
        console.log("DELETE ERROR:", error);
      }

      toast.add({
        title: "Error",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to delete message"
          : "Failed to delete message",
      });
    }
  };

  return (
    <Card className="h-full rounded-2xl border border-white/60 bg-white/80 shadow-lg shadow-indigo-100/30 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        {/* Top section */}
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="min-w-0 flex-1 text-base font-semibold text-gray-900">
            {message.title}
          </CardTitle>

          {/* Delete button */}
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              }
            />

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Message */}
        <CardDescription className="mt-4 wrap-break-word text-sm leading-6 text-gray-600">
          {message.content}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
