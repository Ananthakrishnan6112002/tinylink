import { prisma } from "@/lib/prisma";

export default async function CodeStatsPage({ params }) {
  const { code } = params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    // Next.js will show default 404 page
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Not found</h1>
          <p className="text-sm text-slate-400">
            No link found for code "{code}".
          </p>
        </div>
      </main>
    );
  }

  const baseUrl =
    process.env.BASE_URL || "http://localhost:3000";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Stats for "{link.code}"</h1>

        <div className="space-y-2 border border-slate-800 rounded-xl p-4 text-sm">
          <div>
            <span className="font-medium">Short URL:</span>{" "}
            <a
              href={`${baseUrl}/${link.code}`}
              className="text-emerald-400 hover:underline break-all"
            >
              {baseUrl}/{link.code}
            </a>
          </div>

          <div>
            <span className="font-medium">Target URL:</span>{" "}
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline break-all"
            >
              {link.url}
            </a>
          </div>

          <div>
            <span className="font-medium">Total clicks:</span>{" "}
            {link.clickCount}
          </div>

          <div>
            <span className="font-medium">Last clicked:</span>{" "}
            {link.lastClicked
              ? new Date(link.lastClicked).toLocaleString()
              : "Never"}
          </div>

          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(link.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </main>
  );
}
