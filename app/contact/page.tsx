"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add("is-open");
      });
    });
  }, []);

  function handleClose() {
    const el = overlayRef.current;
    if (!el) { router.push("/"); return; }
    el.classList.remove("is-open");
    setTimeout(() => router.push("/"), 900);
  }

  return (
    <>
      <div ref={overlayRef} className="joro-contact">
        {/* Photo — left half */}
        <div className="joro-contact__photo">
          <Image
            src="/images/2024-10-Retines-Asgard-parquet Pigalle-DSC04495.webp"
            alt="JÖRO Studio — atelier"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
        </div>

        {/* Content — right half */}
        <div className="joro-contact__content">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fermer"
            className="joro-contact__close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
            <span>Fermer</span>
          </button>

          <div className="joro-contact__body">
            <h1 className="joro-contact__title">CONTACTEZ-NOUS</h1>
            <ContactForm />
          </div>
        </div>
      </div>

      <style>{`
        .joro-contact {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          background: #F3F2ED;
          clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
          transform: translateX(5%);
          transition: clip-path 1s cubic-bezier(.25,.74,.22,.99), transform 1s cubic-bezier(.25,.74,.22,.99);
        }
        .joro-contact.is-open {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          transform: translateX(0);
        }

        /* Photo — left 50% */
        .joro-contact__photo {
          position: relative;
          width: 50%;
          flex-shrink: 0;
          overflow: hidden;
          transform: translateX(-5%);
          transition: transform 0.8s 0.2s cubic-bezier(.25,.74,.22,.99);
        }
        .joro-contact.is-open .joro-contact__photo {
          transform: translateX(0);
        }

        /* Content — right 50% */
        .joro-contact__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 28px 60px 60px;
          overflow-y: auto;
          position: relative;
        }

        /* Close button — top right */
        .joro-contact__close {
          align-self: flex-end;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          color: #1C1A18;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1;
          margin-bottom: 60px;
        }
        .joro-contact__close:hover { opacity: 0.6; }

        /* Title */
        .joro-contact__title {
          font-size: 64px;
          font-weight: 700;
          line-height: 110%;
          letter-spacing: -0.01em;
          color: #1C1A18;
          margin-bottom: 48px;
        }

        .joro-contact__body {
          flex: 1;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .joro-contact { flex-direction: column; }
          .joro-contact__photo { width: 100%; height: 220px; }
          .joro-contact__content { padding: 24px 20px 40px; }
          .joro-contact__title { font-size: 32px; margin-bottom: 32px; }
          .joro-contact__close { margin-bottom: 32px; }
        }
      `}</style>
    </>
  );
}
