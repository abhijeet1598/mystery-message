"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useCompletion } from "ai/react";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const parseAIMessages = (messageString: string): string[] => {
  return messageString.split("||");
};

const PublicPage = () => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isReplyChecked, setIsReplyChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);
    try {
      const res = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username: params.username,
        senderEmail: email ? email : "",
      });
      toast({
        title: "Message sent successfully",
        description: res.data.message,
      });
      form.reset({ ...form.getValues(), content: "" });
      if (isReplyChecked) {
        setIsReplyChecked(false);
        setEmail("");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const { complete, completion, error } = useCompletion({
    api: "/api/generate-messages",
    initialCompletion: initialMessageString,
    body: {
      prompt:
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
    },
  });

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate message",
      });
    }
  };

  const handleMessageSelection = async (message: string) => {
    form.setValue("content", message);
  };

  const handleSwitchChange = () => {
    setIsReplyChecked((prev) => !prev);
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  // const onEmojiClick = (event, emojiObject) => {
  //   setContent((prevContent) => prevContent + emojiObject.emoji);
  //   setIsEmojiPickerOpen((prev) => !prev);
  // };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to Mystery Message
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={`Write your anonymous message to @${params.username}`}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="receive-reply"
              checked={isReplyChecked}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="receive-reply">
              Wish to receive a reply from @{params.username}
            </Label>
          </div>
          {isReplyChecked && (
            <Input
              type="email"
              placeholder="Email"
              className="w-1/2"
              value={email}
              onChange={handleEmailChange}
            />
          )}
          {isSending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Button type="submit" disabled={isReplyChecked && email == ""}>
              Send
            </Button>
          )}
        </form>
      </Form>

      <div className="mt-10 mb-10 flex flex-col items-center">
        <Button
          onClick={fetchSuggestedMessages}
          className="flex items-center gap-2"
        >
          <p>Suggest Messages with AI</p>
          <Image width={20} height={20} src="/star.png" alt="sparkler-icon" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Messages</h3>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {error ? (
            <p className="text-red-500">{error.message}</p>
          ) : (
            parseAIMessages(completion).map((message, index) => (
              <Button
                onClick={() => handleMessageSelection(message)}
                key={index}
                variant="outline"
                className="mb-2 text-wrap"
              >
                {message}
              </Button>
            ))
          )}
        </CardContent>
      </Card>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default PublicPage;
