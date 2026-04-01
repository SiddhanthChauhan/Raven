'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react'; // Swapped Mail for Feather to fit the Raven theme
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/src/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content - Wrapped in the dark zinc theme and serif font */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 bg-zinc-950 text-zinc-300 font-serif">
        <section className="text-center mb-12 md:mb-16">
          {/* Thematic hero copy with wide tracking for a cinematic feel */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-widest text-zinc-100 drop-shadow-sm mb-4">
            Whisper into the Void.
          </h1>
          <p className="mt-4 text-base md:text-xl text-zinc-400 italic tracking-wide">
            Raven — Let your words take flight, while your name remains in shadows.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]} // Slowed delay slightly for a more dramatic read
          className="w-full max-w-lg md:max-w-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                {/* Styled the cards to look like dark parchment/letters */}
                <Card className="bg-zinc-900 border-zinc-800 rounded-sm shadow-none">
                  <CardHeader className="border-b border-zinc-800/50 pb-4">
                    <CardTitle className="text-zinc-100 tracking-wide text-lg">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 pt-6">
                    {/* Thematic Feather icon acting as a quill/bird reference */}
                    <Feather className="flex-shrink-0 text-zinc-500 w-6 h-6" />
                    <div>
                      <p className="text-zinc-300 leading-relaxed font-medium">
                        "{message.content}"
                      </p>
                      <p className="text-xs text-zinc-500 italic mt-4 tracking-wider">
                        Received: {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer - Subtle and muted */}
      <footer className="text-center p-6 bg-zinc-950 border-t border-zinc-900 text-zinc-600 font-serif text-sm tracking-wide">
        © {new Date().getFullYear()} Raven. All secrets kept.
      </footer>
    </>
  );
}