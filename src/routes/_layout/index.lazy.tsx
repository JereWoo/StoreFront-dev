import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/9ui/button";
import { ActionToggle } from "@/components/ui/mantine/ActionToggle";
export const Route = createLazyFileRoute("/_layout/")({
  component: Index,
});

// TODO: Gracie Idea add / create a "booktok" integration.
// TODO: Move Ready to start your collection to the hero/top of page.
// focus on building the collection / community a and then make it easy to buy/sell those items in your collection. Focus on special editions etc.
// make make a tool that does "missing from collection".

function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        id="hero"
        className="bg-emerald-900 text-white text-center py-20 px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Hero Section with Branding / Tagline
          <ActionToggle />
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Catchy one-liner that explains NEB’s value.
        </p>
        <Button className="bg-white text-emerald-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          <Link to="/products">Browse Products</Link>
        </Button>
      </section>

      {/* Brands / Collections */}
      <section id="brands-collections" className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Popular Brands / Collections
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-24 bg-white shadow rounded flex items-center justify-center">
            Brand 1
          </div>
          <div className="h-24 bg-white shadow rounded flex items-center justify-center">
            Brand 2
          </div>
          <div className="h-24 bg-white shadow rounded flex items-center justify-center">
            Brand 3
          </div>
          <div className="h-24 bg-white shadow rounded flex items-center justify-center">
            Brand 4
          </div>
        </div>
      </section>

      {/* Explore */}
      <section id="explore" className="py-16 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Explore Rare Books
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-32 bg-emerald-100 rounded flex items-center justify-center">
            Genre
          </div>
          <div className="h-32 bg-emerald-100 rounded flex items-center justify-center">
            Era
          </div>
          <div className="h-32 bg-emerald-100 rounded flex items-center justify-center">
            Author
          </div>
          <div className="h-32 bg-emerald-100 rounded flex items-center justify-center">
            More…
          </div>
        </div>
      </section>

      {/* Popular Books */}
      <section id="popular-books" className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-center">Popular Books</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 bg-white shadow rounded flex items-center justify-center"
            >
              Book {i}
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-16 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          What Collectors Are Saying
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 bg-gray-100 rounded shadow">⭐ Review 1</div>
          <div className="p-6 bg-gray-100 rounded shadow">⭐ Review 2</div>
          <div className="p-6 bg-gray-100 rounded shadow">⭐ Review 3</div>
        </div>
      </section>

      {/* Magazine */}
      <section id="magazine" className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-center">
          From the NEB Journal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-white shadow rounded flex items-center justify-center"
            >
              Blog Post {i}
            </div>
          ))}
        </div>
      </section>

      {/* Social Feeds */}
      <section id="social-feeds" className="py-16 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Community Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-emerald-100 rounded flex items-center justify-center">
            Instagram Feed
          </div>
          <div className="h-40 bg-emerald-100 rounded flex items-center justify-center">
            YouTube Feed
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <ol className="max-w-2xl mx-auto space-y-4 list-decimal list-inside">
          <li>Sign Up</li>
          <li>Find Your Dream Book</li>
          <li>Pay Securely</li>
          <li>Review Your Book</li>
          <li>Seller Gets Paid</li>
        </ol>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="py-20 px-6 bg-emerald-900 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Collection?
        </h2>
        <button className="bg-white text-emerald-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Join Now
        </button>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 bg-white shadow rounded">Q1: …</div>
          <div className="p-6 bg-white shadow rounded">Q2: …</div>
          <div className="p-6 bg-white shadow rounded">Q3: …</div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-emerald-950 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>Branding / Logo</div>
          <div>Links</div>
          <div>Newsletter Signup</div>
        </div>
      </footer>
    </div>
  );
}
