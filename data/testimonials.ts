import type { Testimonial } from "@/types";

export interface TestimonialCard extends Testimonial {
  location: string;
  photo: string;
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
    photo: "/images/haiku/1 (1).webp",
  },
  {
    id: "coinshare",
    author: "Coinshare",
    role: "Fondateur",
    company: "Coinshare",
    location: "Paris 8e",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    photo: "/images/coinshare/1.webp",
  },
  {
    id: "lemlist",
    author: "Lemlist",
    role: "Fondateur",
    company: "Lemlist",
    location: "Paris 11e",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    photo: "/images/lemlist/1 (2).webp",
  },
  {
    id: "confidentiel",
    author: "Confidentiel",
    role: "Client",
    company: "Confidentiel",
    location: "",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    photo: "/images/2024-01-Retines-Pigalle-_23A2312-web 2.webp",
  },
];
