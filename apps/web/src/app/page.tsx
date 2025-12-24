import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="card">
        <h1>Join a help session</h1>
        <p>
          Enter the code provided by your loved one to view their screen and offer
          real-time guidance.
        </p>
        <Link href="/join">
          <button type="button">Go to Join</button>
        </Link>
      </section>
    </main>
  );
}
