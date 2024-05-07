"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Message } from "@/model/user.model";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "./ui/button";
import { CircleAlert, CircleCheckBig, X } from "lucide-react";
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
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type messageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: messageCardProps) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isReplied, setIsReplied] = useState(false);
  const { toast } = useToast();
  const { senderEmail } = message;

  const handleDelete = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleReplyMessageChange = (e: any) => {
    setReplyMessage(e.target.value);
  };

  const handleReplyToSender = async () => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-reply", {
        messageId: message._id,
        replyMessage,
      });
      setReplyMessage("");
      setIsReplied(true);
      toast({
        title: "Reply sent successfully",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
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
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        {!message.isReplied && !isReplied && message.senderEmail && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Reply</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-4/5 w-full:sm">
              <DialogHeader>
                <DialogTitle>Reply to sender</DialogTitle>
                <DialogDescription>
                  Your reply will be emailed to the sender of this message
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center justify-center">
                  <Textarea
                    placeholder="write your reply here"
                    value={replyMessage}
                    onChange={handleReplyMessageChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleReplyToSender}
                  type="submit"
                  disabled={isSending}
                >
                  {isSending ? "Sending" : "Send"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {(message.isReplied || isReplied) && (
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <CircleCheckBig color="#19d76b" />
              You have replied to this message
            </AlertTitle>
          </Alert>
        )}
        {!message.senderEmail && (
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <CircleAlert />
              Sender has not opted for reply
            </AlertTitle>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
