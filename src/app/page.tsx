"use client";

import { useState, type HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-zinc-900 dark:to-zinc-800">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            🔥 Cold Email Roaster
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Paste your cold email below and get a brutally honest critique,
            an improved version, and learn why it&apos;s better.
            <br />
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              Roast first, fix second.
            </span>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
            <label
              htmlFor="email-input"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Paste your cold email here:
            </label>
            <textarea
              id="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Hi [Name],

I hope this email finds you well. I wanted to reach out because I noticed your company is doing great things in [industry]...

(Paste your full cold email here)"
              className="w-full h-64 p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              required
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="mt-4 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-zinc-400 disabled:to-zinc-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Roasting...
                </span>
              ) : (
                "🔥 Roast My Email"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl mb-8">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              Results
            </h2>
            <div className="prose prose-zinc dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-zinc-50 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50 prose-ul:text-zinc-700 dark:prose-ul:text-zinc-300 prose-ol:text-zinc-700 dark:prose-ol:text-zinc-300 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-code:text-orange-600 dark:prose-code:text-orange-400 prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-blockquote:border-l-orange-500 prose-blockquote:text-zinc-600 dark:prose-blockquote:text-zinc-400 max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (props) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 text-zinc-900 dark:text-zinc-50" {...props} />
                  ),
                  h2: (props) => (
                    <h2 className="text-2xl font-bold mt-6 mb-3 text-zinc-900 dark:text-zinc-50" {...props} />
                  ),
                  h3: (props) => (
                    <h3 className="text-xl font-semibold mt-4 mb-2 text-zinc-900 dark:text-zinc-50" {...props} />
                  ),
                  p: (props) => (
                    <p className="mb-4 leading-7 text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  ul: (props) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 ml-4 text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4 text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  li: (props) => (
                    <li className="leading-7 text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  strong: (props) => (
                    <strong className="font-bold text-zinc-900 dark:text-zinc-50" {...props} />
                  ),
                  em: (props) => (
                    <em className="italic text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  code: ({ inline, className, children, ...props }: HTMLAttributes<HTMLElement> & { inline?: boolean }) =>
                    inline ? (
                      <code
                        className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="p-4 bg-zinc-900 dark:bg-zinc-950 text-zinc-100 rounded-lg overflow-x-auto text-sm font-mono mb-4">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ),
                  blockquote: (props) => (
                    <blockquote
                      className="border-l-4 border-orange-500 pl-4 italic my-4 text-zinc-600 dark:text-zinc-400"
                      {...props}
                    />
                  ),
                  hr: (props) => (
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" {...props} />
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <footer className="text-center mt-12 text-zinc-500 dark:text-zinc-400 text-sm">
          <p>
            Built to help you write cold emails that actually get responses.
          </p>
        </footer>
      </main>
    </div>
  );
}
