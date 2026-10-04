import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
        Error 404
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base text-gray-600">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Back to home
      </Link>
    </main>
  );
}
