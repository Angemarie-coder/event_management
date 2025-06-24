import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-blue-900">
      <section className="flex flex-col md:flex-row items-center gap-10 p-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl max-w-4xl w-full">
        <div className="flex-1 flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-200 mb-4">
            Welcome to EventEase!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-6">
            Discover, book, and experience amazing events. Register now to secure your spot at the most exciting happenings in town!
          </p>
          <div className="flex gap-4">
            <Link href="/Register">
              <span className="inline-block px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-800 transition-colors cursor-pointer">
                Register Now
              </span>
            </Link>
            <Link href="/Events">
              <span className="inline-block px-6 py-3 bg-white text-blue-700 border border-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer">
                View Events
              </span>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/globe.svg"
            alt="Event platform hero"
            width={350}
            height={350}
            className="rounded-xl shadow-lg object-contain bg-blue-100 dark:bg-blue-950"
            priority
          />
        </div>
      </section>
    </main>
  );
}
