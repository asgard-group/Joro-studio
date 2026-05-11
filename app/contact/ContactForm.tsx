"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Replace with your actual form submission logic (e.g. Resend, Formspree)
    try {
      await new Promise((res) => setTimeout(res, 1000)); // placeholder
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4 border border-cream-300 p-12 text-center">
        <span className="text-3xl">✓</span>
        <h3 className="font-serif text-xl text-charcoal">Message envoyé</h3>
        <p className="text-sm text-charcoal-muted">
          Merci ! Nous vous répondrons dans les 48h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Prénom & Nom"
          name="name"
          type="text"
          placeholder="Jean Martin"
          required
          autoComplete="name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="jean@entreprise.fr"
          required
          autoComplete="email"
        />
      </div>
      <Input
        label="Société"
        name="company"
        type="text"
        placeholder="Votre entreprise"
        autoComplete="organization"
      />
      <Input
        label="Sujet"
        name="subject"
        type="text"
        placeholder="Ex. : Aménagement bureaux 300 m² — Paris"
        required
      />
      <Textarea
        label="Votre message"
        name="message"
        placeholder="Décrivez votre projet, vos contraintes, votre calendrier..."
        required
        rows={6}
      />
      <p className="text-xs text-charcoal-muted">
        En soumettant ce formulaire, vous acceptez que vos données soient
        utilisées pour traiter votre demande conformément à notre{" "}
        <a href="/privacy" className="underline hover:text-terracotta">
          politique de confidentialité
        </a>
        .
      </p>
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer ou nous écrire directement
          à contact@jorostudio.fr.
        </p>
      )}
    </form>
  );
}
