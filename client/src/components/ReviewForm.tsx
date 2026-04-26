import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Star } from "lucide-react";

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitReview = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setPatientName("");
      setPatientEmail("");
      setTitle("");
      setContent("");
      setRating(5);
      setServiceType("");
      
      // Track in Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "review_submission", {
          rating: rating,
          service_type: serviceType,
        });
      }
      
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => {
      alert(`Fehler beim Einreichen der Bewertung: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName || !patientEmail || !title || !content) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus");
      return;
    }

    submitReview.mutate({
      patientName,
      patientEmail,
      rating,
      title,
      content,
      serviceType,
    });
  };

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Ihre Bewertung</h3>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            ✓ Vielen Dank für Ihre Bewertung! Sie wird nach Überprüfung veröffentlicht.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <Label className="text-gray-700 font-semibold mb-3 block">
            Bewertung (1-5 Sterne) *
          </Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{rating} von 5 Sternen</p>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-gray-700 font-semibold">
            Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Ihr Name"
            className="mt-2"
            required
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-gray-700 font-semibold">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder="ihre.email@beispiel.de"
            className="mt-2"
            required
          />
        </div>

        {/* Service Type */}
        <div>
          <Label htmlFor="service" className="text-gray-700 font-semibold">
            Art der Leistung
          </Label>
          <Input
            id="service"
            type="text"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="z.B. Häusliche Pflege, Beratung"
            className="mt-2"
          />
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-gray-700 font-semibold">
            Titel *
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kurze Zusammenfassung Ihrer Erfahrung"
            className="mt-2"
            required
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content" className="text-gray-700 font-semibold">
            Ihre Bewertung *
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Beschreiben Sie Ihre Erfahrung mit unseren Dienstleistungen (mindestens 10 Zeichen)"
            className="mt-2 min-h-32"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            {content.length} / 10 Zeichen erforderlich
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={submitReview.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {submitReview.isPending ? "Wird eingereicht..." : "Bewertung einreichen"}
        </Button>
      </form>
    </Card>
  );
}
