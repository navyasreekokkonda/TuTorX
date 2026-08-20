"use client";
import CourseRoadmap from "@/app/components/CourseRoadmap";
import FloatingNotepad from "@/app/components/FloatingNotepad";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Code } from "lucide-react";
import CodeEditor from "@/app/components/CodeEditor";


/* ================================================= */
/* ================= MAIN COMPONENT ================= */
/* ================================================= */
export default function CourseUI({ course }) {
  const router = useRouter();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [view, setView] = useState("content");

  const [progress, setProgress] = useState(null);

  const chapter = course.chapters[activeChapterIndex];
  const topic = chapter.topics[activeTopicIndex];

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch(`/api/progress?courseId=${course._id}`);
        const data = await res.json();

        if (data) {
          setProgress(data);

          if (data.lastViewed) {
            setActiveChapterIndex(data.lastViewed.chapterIndex);
            setActiveTopicIndex(data.lastViewed.topicIndex);
          }
        }
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    }
    loadProgress();
  }, [course._id]);

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-gray-200 font-sans overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <div className="w-72 bg-[#0e0e12]/90 backdrop-blur-md border-r border-white/[0.06] overflow-y-auto shrink-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-white/[0.06] space-y-3">
            {/* BACK TO DASHBOARD */}
            <button
              onClick={() => {
                sessionStorage.removeItem("dashboard_courses_v2");
                sessionStorage.removeItem("dashboard_progress_v2");
                sessionStorage.removeItem("dashboard_stats_v2");
                router.push("/dashboard");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141418] border border-white/10 text-[11px] font-bold text-gray-400 hover:text-white hover:border-white/20 transition shadow-sm"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Dashboard</span>
            </button>

            <div>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">Course Curriculum</span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide leading-snug mt-0.5 truncate">
                {course.title}
              </h2>
            </div>

            {/* Progress bar */}
            {progress && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Overall Progress</span>
                  <span className="text-gray-300 font-mono">{progress.progressPercent || 0}%</span>
                </div>
                <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progress.progressPercent || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chapters */}
          <div className="p-3 space-y-1.5">
            <span className="px-2 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] block pt-1">Modules</span>
            {course.chapters.map((ch, ci) => (
              <div key={ci}>
                <button
                  onClick={() => {
                    setActiveChapterIndex(ci);
                    setActiveTopicIndex(0);
                    setView("content");
                  }}
                  className={`w-full text-left text-xs font-bold uppercase tracking-wider transition-all px-3 py-2 rounded-xl flex items-center justify-between gap-2 ${
                    ci === activeChapterIndex
                      ? "text-orange-400 bg-[#141418] border border-orange-500/30 shadow-sm"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <span className="truncate">{ci + 1}. {ch.chapterTitle}</span>
                </button>

                {ci === activeChapterIndex && (
                  <div className="ml-3 mt-1.5 space-y-1 pl-2 border-l border-white/10">
                    {ch.topics.map((t, ti) => {
                      const completed = progress?.completedTopics?.some(
                        (ct) => ct.chapterIndex === ci && ct.topicIndex === ti
                      );

                      return (
                        <button
                          key={ti}
                          onClick={() => {
                            setActiveTopicIndex(ti);
                            setView("content");
                          }}
                          className={`flex items-center justify-between w-full text-left text-[11px] font-semibold transition-all px-2.5 py-1 rounded-lg gap-2 ${
                            ti === activeTopicIndex
                              ? "text-white bg-[#18181d] border border-white/10 shadow-sm"
                              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                          }`}
                        >
                          <span className="truncate">{t.title}</span>
                          {completed && (
                            <span className="text-green-400 text-xs shrink-0">✔</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
              )}
            </div>
          ))}
        </div>
        </div>

        {/* Utilities */}
        <div className="p-4 border-t border-white/[0.06] space-y-1.5 bg-[#0b0b0d]">
          {progress?.lastViewed && (
            <button
              onClick={() => {
                setActiveChapterIndex(progress.lastViewed.chapterIndex);
                setActiveTopicIndex(progress.lastViewed.topicIndex);
                setView("content");
              }}
              className="w-full text-left text-orange-400 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <span>▶ Resume Learning</span>
            </button>
          )}

          <button
            onClick={() => setView("roadmap")}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              view === "roadmap" ? "text-orange-400 bg-[#141418] border border-orange-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>📍 Course Roadmap</span>
          </button>
          <button
            onClick={() => setView("flashcards")}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              view === "flashcards" ? "text-orange-400 bg-[#141418] border border-orange-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🃏 AI Flashcards</span>
          </button>
          <button
            onClick={() => setView("quiz")}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              view === "quiz" ? "text-orange-400 bg-[#141418] border border-orange-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>✏️ Topic Quiz</span>
          </button>
          <button
            onClick={() => setView("practice")}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              view === "practice" ? "text-orange-400 bg-[#141418] border border-orange-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>LeetCode Workspace</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 overflow-y-auto">
        {view === "content" && (
          <ArticleView
            topic={topic}
            course={course}
            activeChapterIndex={activeChapterIndex}
            activeTopicIndex={activeTopicIndex}
            onOptimisticComplete={(ci, ti) => {
              setProgress((prev) => {
                if (!prev) return prev;

                const completedTopics = Array.isArray(prev.completedTopics)
                  ? prev.completedTopics
                  : [];

                const exists = completedTopics.some(
                  (t) => t.chapterIndex === ci && t.topicIndex === ti
                );

                if (exists) return prev;

                const updatedCompleted = [
                  ...completedTopics,
                  { chapterIndex: ci, topicIndex: ti },
                ];

                const totalTopics = course.chapters.reduce(
                  (sum, ch) => sum + ch.topics.length,
                  0
                );

                return {
                  ...prev,
                  completedTopics: updatedCompleted,
                  progressPercent: Math.round(
                    (updatedCompleted.length / totalTopics) * 100
                  ),
                };
              });
            }}
            onNext={() => {
              const currentChapter = course.chapters[activeChapterIndex];

              if (activeTopicIndex < currentChapter.topics.length - 1) {
                setActiveTopicIndex(activeTopicIndex + 1);
              } else if (activeChapterIndex < course.chapters.length - 1) {
                setActiveChapterIndex(activeChapterIndex + 1);
                setActiveTopicIndex(0);
              } else {
                alert("🎉 You have completed the course!");
              }
            }}
          />
        )}

        {view === "flashcards" && (
          <FlashcardsSection
            flashcards={topic.flashcards || []}
            onExit={() => setView("content")}
          />
        )}

        {view === "quiz" && <QuizView quiz={topic.quiz || []} />}

        {view === "roadmap" && (
          <CourseRoadmap
            course={course}
            onSelectChapter={(i) => {
              setActiveChapterIndex(i);
              setActiveTopicIndex(0);
              setView("content");
            }}
          />
        )}

        {view === "practice" && <CodeEditor />}
      </div>
      <FloatingNotepad courseId={course._id} />
    </div>
  );
}

/* ================================================= */
/* ================= ARTICLE VIEW ================== */
/* ================================================= */
function ArticleView({
  topic,
  course,
  activeChapterIndex,
  activeTopicIndex,
  onOptimisticComplete,
  onNext,
}) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(null); // null, 'Hindi', 'Telugu'
  const [translatedTopic, setTranslatedTopic] = useState(null);

  useEffect(() => {
    // Reset translation when topic changes
    setTargetLanguage(null);
    setTranslatedTopic(null);
  }, [topic]);

  const handleTranslate = async (lang) => {
    if (lang === targetLanguage) {
      setTargetLanguage(null);
      setTranslatedTopic(null);
      return;
    }

    setIsTranslating(true);
    setTargetLanguage(lang);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: JSON.stringify(topic.content),
          targetLanguage: lang,
        }),
      });

      const rawData = await res.json();
      const data = rawData.data || rawData;
      if (data.translatedText) {
        try {
          // Attempt to parse if the AI returned it as a JSON string
          // Clean up the string first (sometimes AI wraps in ```json)
          let cleanJson = data.translatedText;
          if (cleanJson.includes("```")) {
            cleanJson = cleanJson.split("```")[1].replace(/^json/, "").trim();
          }
          const translatedContent = JSON.parse(cleanJson);
          setTranslatedTopic({ ...topic, content: translatedContent });
        } catch (e) {
          console.error("Failed to parse translated content as JSON, using as raw string:", e);
          // Fallback: If it's not JSON, maybe it's just raw text, but that's unlikely given our prompt
          // For now, just show error or handle gracefully
        }
      }
    } catch (error) {
      console.error("Translation Failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const currentTopic = translatedTopic || topic;

  const markCompleted = async () => {
    onOptimisticComplete(activeChapterIndex, activeTopicIndex);

    setIsCompleting(true);
    try {
      await fetch("/api/progress/topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course._id,
          chapterIndex: activeChapterIndex,
          topicIndex: activeTopicIndex,
        }),
      });
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNext = async () => {
    await markCompleted();
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">{currentTopic.title}</h1>
        <div className="flex items-center gap-2">
          {['Hindi', 'Telugu'].map(lang => (
            <button
              key={lang}
              onClick={() => handleTranslate(lang)}
              disabled={isTranslating}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                targetLanguage === lang 
                ? 'bg-orange-500 border-orange-500 text-black' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              } disabled:opacity-50`}
            >
              {isTranslating && targetLanguage === lang ? '...' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* VIDEO REFERENCES - Show if it's the first topic of the chapter and has videos */}
      {activeTopicIndex === 0 && course.chapters[activeChapterIndex]?.videos?.length > 0 && (
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-2 text-orange-400">
            <span className="text-xs font-bold uppercase tracking-widest">Video Tutorials</span>
            <div className="h-px flex-1 bg-orange-500/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.chapters[activeChapterIndex].videos.map((videoId, idx) => (
              <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTopic.content.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="text-2xl font-semibold text-white mt-8 mb-4"
              >
                {b.text}
              </h2>
            );
          case "text":
            return (
              <p key={i} className="text-gray-300 leading-relaxed mb-4">
                {b.text}
              </p>
            );
          case "list":
            return (
              <ul
                key={i}
                className="list-disc list-inside space-y-2 mb-4 text-gray-300"
              >
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "code":
            return <CodeBlock key={i} code={b.code} />;
          case "output":
            return (
              <pre
                key={i}
                className="bg-gray-900 p-4 rounded-lg mb-4 overflow-x-auto"
              >
                <code className="text-green-400 text-sm">{b.text}</code>
              </pre>
            );
          default:
            return null;
        }
      })}

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={markCompleted}
          disabled={isCompleting}
          className="px-6 py-3 rounded-lg bg-white/10 text-gray-200 text-sm hover:bg-white/20 disabled:opacity-50"
        >
          {isCompleting ? "Saving..." : "Mark as Completed ✓"}
        </button>

        <button
          onClick={handleNext}
          disabled={isCompleting}
          className="px-6 py-2 rounded-lg bg-orange-500 text-black text-sm font-medium hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/* ================= OTHER COMPONENTS UNCHANGED ================= */
/* (CodeBlock, QuizView, Flashcards, FlipCard — same as before) */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative mb-4">
      <button
        onClick={copy}
        className="absolute top-3 right-3 px-3 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-gray-300"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
        <code className="text-gray-300 text-sm">{code}</code>
      </pre>
    </div>
  );
}

/* ================================================= */
/* ================= QUIZ VIEW ===================== */
/* ================================================= */
function QuizView({ quiz }) {
  const QUIZ_TIME_SECONDS = 5 * 60;
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);

  const score = quiz.reduce(
    (s, q, i) => (answers[i] === q.correctAnswer ? s + 1 : s),
    0
  );

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started, submitted, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready for the Quiz?
        </h2>
        <p className="text-gray-400 mb-8">
          You'll have {QUIZ_TIME_SECONDS / 60} minutes to complete this quiz.
          Once started, the timer cannot be paused.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-3 rounded-lg bg-orange-500 text-black text-sm font-medium hover:bg-orange-600"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Quiz Completed</h2>
        <div className="text-6xl font-bold text-orange-500 mb-2">
          {score} / {quiz.length}
        </div>
        <div className="text-gray-400 mb-4">Your Score</div>
        <div className="text-sm text-gray-500">
          Time taken: {formatTime(QUIZ_TIME_SECONDS - timeLeft)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Quiz</h2>
        <div className="flex items-center gap-4">
          <div className="text-orange-400 font-mono">
            ⏱ {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setSubmitted(true)}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:text-white hover:bg-white/5"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {quiz.map((q, i) => (
          <div key={i} className="bg-white/5 p-6 rounded-lg">
            <div className="text-white font-medium mb-4">
              {i + 1}. {q.question}
            </div>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 p-3 rounded hover:bg-white/5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === opt}
                    onChange={() => setAnswers({ ...answers, [i]: opt })}
                    className="accent-orange-500"
                  />
                  <span className="text-gray-300">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================= */
/* ================= FLASHCARDS ==================== */
/* ================================================= */
function FlashcardsSection({ flashcards, onExit }) {
  const [mode, setMode] = useState("grid");

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Flashcards</h2>
          <p className="text-gray-400 text-sm mt-1">Active recall learning</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "grid" ? "study" : "grid")}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-gray-100 hover:bg-white/5"
          >
            {mode === "grid" ? "Study mode" : "Grid view"}
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-gray-100 hover:bg-white/5"
          >
            Exit
          </button>
        </div>
      </div>

      {mode === "grid" ? (
        <FlashcardGrid flashcards={flashcards} />
      ) : (
        <FlashcardStudy flashcards={flashcards} />
      )}
    </div>
  );
}

function FlashcardGrid({ flashcards }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map((f, i) => (
        <FlipCard key={i} front={f.question} back={f.answer} index={i} />
      ))}
    </div>
  );
}

function FlashcardStudy({ flashcards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[index];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center text-gray-400 mb-4">
        {index + 1} / {flashcards.length}
      </div>

      <div
        className="relative w-full h-96 cursor-pointer perspective-1000"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 preserve-3d ${flipped ? "rotate-y-180" : ""
            }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute w-full h-full bg-white/5 border border-white/10 rounded-xl p-8 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-xl text-white text-center">
              {card.question}
            </div>
          </div>

          <div
            className="absolute w-full h-full bg-orange-500/10 border border-orange-500/20 rounded-xl p-8 flex items-center justify-center backface-hidden rotate-y-180"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-lg text-gray-200 text-center">
              {card.answer}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((i) => Math.max(i - 1, 0));
          }}
          disabled={index === 0}
          className="px-5 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5 disabled:opacity-30"
        >
          Prev
        </button>
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((i) => Math.min(i + 1, flashcards.length - 1));
          }}
          disabled={index === flashcards.length - 1}
          className="px-5 py-2 rounded-lg bg-orange-500 text-black text-sm font-medium hover:bg-orange-600 disabled:opacity-30"
        >
          Next
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm mt-4">
        Click the card to flip
      </div>
    </div>
  );
}

function FlipCard({ front, back, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-48 cursor-pointer perspective-1000"
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${flipped ? "rotate-y-180" : ""
          }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute w-full h-full bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-xs text-gray-500 mb-2">Card {index + 1}</div>
          <div className="flex-1 flex items-center justify-center text-center text-white">
            {front}
          </div>
          <div className="text-xs text-gray-500 text-center">
            Click to reveal
          </div>
        </div>

        <div
          className="absolute w-full h-full bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 flex items-center justify-center backface-hidden rotate-y-180"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center text-gray-200">{back}</div>
        </div>
      </div>
    </div>
  );
}
