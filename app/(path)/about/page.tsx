
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Get to know SND Shop: bold prints, everyday comfort, and clothing made for your personal style.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    number: "01",
    title: "Everyday comfort",
    description:
      "Comfortable pieces belong in the everyday rotation. Find styles that feel easy to wear from morning to night.",
  },
  {
    number: "02",
    title: "Style with personality",
    description:
      "Explore expressive prints and versatile designs, and choose the pieces that feel most like you.",
  },
  {
    number: "03",
    title: "A simpler way to shop",
    description:
      "Browse collections, compare product details, and find your next favourite without overcomplicating it.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fffdf9] text-[#171a18]">
      <section className="relative overflow-hidden bg-[#003b1f] px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            About SND Shop
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            Wear what feels like you.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            Bold prints, everyday comfort. SND Shop is a place to explore
            expressive T-shirts and easy-to-wear styles for your daily rotation.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#003b1f] transition hover:bg-white/90"
          >
            Explore the shop
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003b1f]">
            Our point of view
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Good style should feel effortless.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-7 text-[#646b66]">
          <p>
            Getting dressed is a small part of every day, but it can still be a
            chance to show a little personality. We bring together wearable
            silhouettes and designs that help make that choice feel simple.
          </p>
          <p>
            Whether you are looking for a relaxed everyday tee or a graphic
            piece that stands out, explore the collection and make it your own.
          </p>
        </div>
      </section>

      <section className="bg-[#f4f7f5] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003b1f]">
            The SND Shop experience
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Made for your everyday
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.number}
                className="rounded-2xl border border-[#e5ebe6] bg-white p-6 sm:p-7"
              >
                <span className="text-sm font-semibold text-[#003b1f]">
                  {value.number}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#646b66]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center sm:px-8 sm:py-20">
        <h2 className="text-3xl font-semibold">Find your next favourite.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#646b66] sm:text-base">
          Take a look around or get in touch if you need a hand.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#003b1f] px-6 text-sm font-semibold text-white transition hover:bg-[#002d18]"
          >
            Shop now
          </Link>
          <Link
            href="/contactus"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#003b1f] px-6 text-sm font-semibold text-[#003b1f] transition hover:bg-[#f4f7f5]"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}