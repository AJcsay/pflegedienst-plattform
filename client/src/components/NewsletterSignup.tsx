import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Bitte geben Sie Ihre Email-Adresse ein.");
      return;
    }

    setIsLoading(true);
    try {
      await subscribeMutation.mutateAsync({
        email,
        firstName: firstName || undefined,
      });

      // Track in Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "newsletter_signup", {
          email_provided: !!email,
          first_name_provided: !!firstName,
        });
      }

      toast.success("Anmeldung erfolgreich! Bitte überprüfen Sie Ihr Email-Postfach.");
      setEmail("");
      setFirstName("");
    } catch (error: any) {
      toast.error(error?.message || "Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-3">
        <div>
          <Input
            type="text"
            placeholder="Vorname (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Ihre Email-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLoading ? "Wird angemeldet..." : "Anmelden"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Wir respektieren Ihre Privatsphäre. Sie können sich jederzeit abmelden.
        </p>
      </div>
    </form>
  );
}
