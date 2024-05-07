"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { useTypewriter, Cursor } from "react-simple-typewriter";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";

const words = [
  {
    text: "Want",
  },
  {
    text: "to",
  },
  {
    text: "receive",
  },
  {
    text: "message",
  },
  {
    text: "anonymously?",
    className: "text-blue-500 dark:text-blue-500",
  },
];

export default function Home() {
  const [text] = useTypewriter({
    words: ["messages?", "feedbacks?", "opinions?"],
    loop: false,
  });
  return (
    <>
      {/* Main content */}
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-1 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Want to receive anonymous{" "}
            <span className="text-blue-500 dark:text-blue-500 md:text-6xl">
              {text}
            </span>
            <Cursor cursorColor="blue" />
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-wrap">
            Now everyone will be able to send messages - Where their identity
            remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-4/5 max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-2 md:p-4 bg-gray-900 text-white absolute bottom-0 w-full">
        © 2024 Mystery Message. All rights reserved.
      </footer>
    </>
  );
}
