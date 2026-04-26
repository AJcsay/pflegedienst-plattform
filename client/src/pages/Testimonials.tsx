import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";
import { ReviewForm } from "@/components/ReviewForm";
import { Star, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Testimonials() {
  useSEO({
    title: "Bewertungen & Testimonials – CuraMain",
    description: "Lesen Sie echte Bewertungen von unseren Patienten und Kunden. Erfahren Sie, wie CuraMain ihnen geholfen hat.",
    keywords: "Bewertungen, Testimonials, Kundenerfahrungen, Pflegedienstleistungen",
    canonical: "https://www.curamain.de/testimonials",
  });

  const { data: reviews, isLoading: reviewsLoading } = trpc.reviews.getPublished.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.reviews.getStats.useQuery();

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-cm-teal-100"}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-cm-cream">
      {/* HERO */}
      <section
        className="relative min-h-[300px] hero-bg -mt-24 pt-24"
        style={{ background: "linear-gradient(135deg, #daedeb 0%, #f9f6f1 100%)" }}
      >
        <div className="relative z-10 container pt-6 pb-10">
          <span className="pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/60 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {stats?.totalReviews
              ? `${stats.averageRating.toFixed(1)} von 5 Sternen · ${stats.totalReviews} Bewertungen`
              : "Echte Stimmen unserer Patienten"}
          </span>
          <h1 className="h-serif text-5xl lg:text-7xl text-cm-teal mt-6 mb-6 max-w-3xl leading-[1.05]">
            Echte Stimmen.<br />Echte Erfahrungen.
          </h1>
          <p className="text-lg text-cm-ink/80 max-w-2xl leading-relaxed">
            Erfahren Sie, was unsere Patienten und ihre Angehörigen über uns sagen.
          </p>
        </div>
      </section>

      <div className="container py-12 lg:py-14">
        {/* STATS */}
        {statsLoading ? (
          <div className="mb-10 space-y-4">
            <Skeleton className="h-32 w-full rounded-3xl" />
          </div>
        ) : stats && stats.totalReviews > 0 ? (
          <div className="bg-white rounded-3xl border border-cm-teal-100 p-10 mb-10 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="h-serif text-6xl font-semibold text-cm-teal-600">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center my-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-sm text-cm-ink/60">Durchschnittliche Bewertung</p>
            </div>
            <div>
              <div className="h-serif text-6xl font-semibold text-cm-teal-600">
                {stats.totalReviews}
              </div>
              <p className="text-sm text-cm-ink/60 mt-3">Bewertungen gesamt</p>
            </div>
            <div>
              <div className="h-serif text-6xl font-semibold text-cm-teal-600">
                {stats.ratingDistribution[5] || 0}
              </div>
              <p className="text-sm text-cm-ink/60 mt-3">5-Sterne-Bewertungen</p>
            </div>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews */}
          <div className="lg:col-span-2">
            <h2 className="h-serif text-3xl text-cm-ink mb-6">Kundenbewertungen</h2>

            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-3xl" />
                ))}
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-7 rounded-3xl border border-cm-teal-100 relative hover:shadow-md transition-shadow"
                  >
                    <Quote className="w-7 h-7 text-cm-teal-200 absolute top-5 right-5" />
                    <div className="flex items-start justify-between mb-3 pr-8">
                      <div>
                        <h3 className="font-semibold text-cm-ink">{review.patientName}</h3>
                        {review.serviceType && (
                          <p className="text-xs text-cm-ink/60 mt-0.5">{review.serviceType}</p>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">{renderStars(review.rating)}</div>
                    <h4 className="font-medium text-cm-ink mb-2">{review.title}</h4>
                    <p className="text-cm-ink/75 text-sm italic leading-relaxed mb-4">
                      „{review.content}"
                    </p>
                    <p className="text-xs text-cm-ink/50 border-t border-cm-teal-50 pt-3">
                      {new Date(review.createdAt).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-cm-teal-100 text-center">
                <p className="text-cm-ink/60">
                  Noch keine Bewertungen vorhanden. Seien Sie der Erste!
                </p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div>
            <div className="bg-cm-teal-50 p-7 rounded-3xl sticky top-32">
              <h2 className="h-serif text-2xl text-cm-ink mb-2">Ihre Bewertung</h2>
              <p className="text-sm text-cm-ink/70 mb-5">
                Teilen Sie Ihre Erfahrung mit anderen Patientinnen und Patienten.
              </p>
              <ReviewForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
