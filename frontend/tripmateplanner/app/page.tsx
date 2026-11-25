"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TravelResponse {
  success: boolean;
  thread_id: string;
  answer: string;
  flight_results?: unknown;
  hotel_results?: unknown;
  itinery?: unknown;
  llm_calls?: unknown;
  error?: string;
}

const prompts = [
  {
    label: "🇯🇵 Japan Trip",
    message:
      "Plan a complete 7 days Japan trip from Bangladesh including flights, hotels and sightseeing under 2 lakhs.",
  },
  {
    label: "🇦🇪 Dubai Trip",
    message:
      "Plan a 5 days Dubai trip from Dhaka with flights, hotels and sightseeing.",
  },
  {
    label: "🇹🇭 Thailand Trip",
    message:
      "Plan a 7 days Thailand trip from Bangladesh with budget hotels and sightseeing.",
  },
  {
    label: "✈️ Global Flights",
    message: "Give me all country flight info.",
  },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedThread = localStorage.getItem("travel_thread_id");

    if (savedThread) {
      setThreadId(savedThread);
    }
  }, []);

  const sendMessage = async () => {
    setError("");
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/travel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          thread_id: threadId,
        }),
      });

      const data: TravelResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Something went wrong.");
      }

      setThreadId(data.thread_id);
      localStorage.setItem("travel_thread_id", data.thread_id);

      setAnswer(data.answer);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "unable to generate travel plan",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy travel plan");
    }
  };

  const downloadPDF = () => {
    if (!answer) return;
    window.print();
  };

  return (
    <>
      <main className="page-container">
        <div className="background-glow glow-one" />
        <div className="background-glow glow-two" />
        <div className="background-glow glow-three" />

        <div className="app-container">
          {/* HERO SECTION */}

          <section className="hero-section">
            <div className="hero-badge">
              ✈️ TripMate AI — Multi-Agent Travel Planner
            </div>

            <h1>
              Plan Your Perfect Trip
              <span> With AI</span>
            </h1>

            <p>
              Search flights, discover hotels, and generate personalized travel
              itineraries using an intelligent LangGraph multi-agent system.
            </p>
          </section>

          {/* PLANNER CARD */}
          <section className="planner-card">
            <div className="card-header">
              <div>
                <h2>Where do you want to go?</h2>

                <p>
                  Tell us your destination, budget, duration and travel
                  preferences.
                </p>
              </div>

              <div className="status-pill">
                <span className="status-dot" />
                Online
              </div>
            </div>

            <div className="input-area">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Plan a complete 7 days Japan trip including flights, hotels and sightseeing..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    sendMessage();
                  }
                }}
              />

              <button
                className="generate-btn"
                onClick={sendMessage}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loader" />
                    Planning...
                  </>
                ) : (
                  "Generate Plan →"
                )}
              </button>
            </div>

            {/* QUICK PROMPTS */}

            <div className="quick-prompts">
              {prompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => setMessage(prompt.message)}
                  disabled={loading}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </section>

          {/* ERROR */}

          {error && <div className="error-box">{error}</div>}

          {/* LOADING */}

          {loading && (
            <div className="loading-card">
              <span className="loader large-loader" />
              <h3>Creating your travel experience...</h3>
              <p>
                Our AI agents are researching your destination, flights, hotels
                and itinerary.
              </p>
            </div>
          )}

          {/* RESULTS */}

          {answer && !loading && (
            <section id="results" className="result-section">
              <div className="result-header">
                <div>
                  <h2>Your AI Travel Plan</h2>

                  <p>Conversation ID: {threadId}</p>
                </div>

                <div className="result-actions">
                  <button className="copy-btn" onClick={copyResult}>
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  <button className="download-btn" onClick={downloadPDF}>
                    Download PDF
                  </button>
                </div>
              </div>

              <article id="pdf-content" className="markdown-content">
                <h1 className="pdf-title">TripMate AI Travel Plan</h1>

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {answer}
                </ReactMarkdown>
              </article>
            </section>
          )}
        </div>

        <footer>
          Built with Next.js, FastAPI, LangGraph, Groq, PostgreSQL and Tavily
        </footer>
      </main>
    </>
  );
}














