export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  href: string;
  image?: string;
}

export interface WorkItem {
  id: string;
  title: string;
  client?: string;
  location: string;
  year: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: string;
  images?: string[];
  featured?: boolean;
  caseStudy?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  location?: string;
  photo?: string;
  logo?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
