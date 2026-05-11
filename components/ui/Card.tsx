import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  href?: string;
  tags?: string[];
  className?: string;
  variant?: "default" | "horizontal";
}

export default function Card({
  title,
  subtitle,
  description,
  image,
  href,
  tags,
  className,
  variant = "default",
}: CardProps) {
  const inner = (
    <article
      className={cn(
        "group overflow-hidden bg-cream-100 transition-all duration-300",
        href && "hover:-translate-y-1 hover:shadow-lg",
        variant === "horizontal" && "flex gap-6",
        className
      )}
    >
      {image && (
        <div
          className={cn(
            "relative overflow-hidden bg-cream-300",
            variant === "horizontal" ? "h-auto w-48 shrink-0" : "aspect-[4/3] w-full"
          )}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {subtitle && (
          <p className="label-eyebrow">{subtitle}</p>
        )}
        <h3 className="font-serif text-xl leading-snug text-charcoal">{title}</h3>
        {description && (
          <p className="text-sm leading-relaxed text-charcoal-muted line-clamp-3">
            {description}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-none bg-cream-200 px-2 py-0.5 text-xs text-charcoal-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}
