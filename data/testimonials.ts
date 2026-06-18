import type { Testimonial } from "@/types";

export interface TestimonialCard extends Testimonial {
  location: string;
  images: string[];
}

export const testimonials: TestimonialCard[] = [
  {
    id: "haiku",
    author: "Haiku",
    role: "Fondateur",
    company: "Haiku",
    location: "Paris 9e",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    images: [
      "/images/haiku/1 (1).webp",
      "/images/haiku/2 (1).webp",
      "/images/haiku/3 (1).webp",
      "/images/haiku/4 (1).webp",
      "/images/haiku/5 (1).webp",
      "/images/haiku/6 (1).webp",
      "/images/haiku/7 (1).webp",
      "/images/haiku/8 (2).webp",
      "/images/haiku/9 (2).webp",
    ],
  },
  {
    id: "coinshare",
    author: "Coinshare",
    role: "Fondateur",
    company: "Coinshare",
    location: "Paris 8e",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    images: [
      "/images/coinshare/1.webp",
      "/images/coinshare/2.webp",
      "/images/coinshare/3.webp",
      "/images/coinshare/4.webp",
      "/images/coinshare/5.webp",
      "/images/coinshare/6.webp",
      "/images/coinshare/7.webp",
      "/images/coinshare/8.webp",
      "/images/coinshare/9.webp",
    ],
  },
  {
    id: "lemlist",
    author: "Lemlist",
    role: "Fondateur",
    company: "Lemlist",
    location: "Paris 11e",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    images: [
      "/images/lemlist/1 (2).webp",
      "/images/lemlist/2 (2).webp",
      "/images/lemlist/3 (2).webp",
      "/images/lemlist/4 (2).webp",
      "/images/lemlist/5 (2).webp",
      "/images/lemlist/6 (2).webp",
      "/images/lemlist/7 (2).webp",
      "/images/lemlist/8 (3).webp",
      "/images/lemlist/9 (3).webp",
    ],
  },
];
