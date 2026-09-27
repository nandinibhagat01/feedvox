"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "@/src/messages.json";
import { ArrowRight, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero */}
      <section className="relative">
        {/* Background decorations */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 sm:pb-24 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
              Your voice. Your privacy.
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Say what you really{" "}
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                think.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              FeedVox lets your friends send you honest, anonymous messages.
              Share your unique link and discover what people really want to
              say.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/sign-up">
                <button className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-7 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl sm:w-auto">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>

              <Link href="/sign-in">
                <button className="h-12 w-full rounded-xl border border-gray-200 bg-white/80 px-7 font-semibold text-gray-700 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 sm:w-auto">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Message carousel */}
      <section className="relative px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              What could your inbox look like?
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              A few examples of the messages your friends could send.
            </p>
          </div>

          <Carousel
            opts={{
              loop: true,
              align: "center",
            }}
            plugins={[
              AutoPlay({
                delay: 2500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="mx-auto w-full max-w-md"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-2">
                    <Card className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
                      <CardHeader className="border-b border-gray-100/80 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-100 to-purple-100 text-indigo-600">
                              <Heart className="h-4 w-4 fill-indigo-500" />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {message.title}
                              </p>
                              <p className="text-xs text-gray-400">Anonymous</p>
                            </div>
                          </div>

                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                            Anonymous
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex min-h-52 items-center justify-center p-8 text-center">
                        <p className="text-lg font-medium leading-8 text-gray-700">
                          “{message.content}”
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="-left-12 hidden border-gray-200 bg-white shadow-md sm:flex" />
            <CarouselNext className="-right-12 hidden border-gray-200 bg-white shadow-md sm:flex" />
          </Carousel>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Messages are completely anonymous
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/70 bg-white/50 px-6 py-16 backdrop-blur">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Honest Messages
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Give people a comfortable space to say what they really think.
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">Stay Anonymous</h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Receive messages without revealing who sent them.
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Heart className="h-5 w-5" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Share Your Link
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Share your personal FeedVox link and start receiving messages.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/60 px-6 py-8 text-center">
        <p className="text-sm text-gray-500">
          © 2026 <span className="font-semibold text-indigo-600">FeedVox</span>.
          All rights reserved.
        </p>
      </footer>
    </main>
  );
}
