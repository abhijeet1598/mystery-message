"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameCheckMsg, setUsernameCheckMsg] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(
    username,
    500
  );
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsernameUnique = async () => {
    if (debouncedUsername) {
      setIsCheckingUsername(true);
      setUsernameCheckMsg("");

      try {
        const res = await axios.get(
          `/api/check-unique-username?username=${debouncedUsername}`
        );
        setUsernameCheckMsg(res.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameCheckMsg(
          axiosError.response?.data.message ?? "Error while checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      const res = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast({
        title: "Success",
        description: res.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Sign-up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    checkUsernameUnique();
  }, [debouncedUsername]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6 text-center">
          Want to message anonymously?
        </h1>
        <p className="text-center font-bold">
          Sign up below to send messages anonymously to anyone
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col item-center justify-center gap-6"
          >
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write your username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {isCheckingUsername && <Loader2 className="animate-spin" />}
              {!isCheckingUsername && usernameCheckMsg && (
                <p
                  className={`text-sm ${
                    usernameCheckMsg === "Username available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {usernameCheckMsg}
                </p>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Write your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Please wait" : "Sign up"}
              </Button>
              <p>
                Already have an account?{" "}
                <Link href={"/sign-in"} className="text-blue-600">
                  <strong>Sign in</strong>
                </Link>{" "}
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;
