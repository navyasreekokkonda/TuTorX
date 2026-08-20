function ChatBox({ notes }) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  const ask = async () => {
    const res = await fetch("/api/notebook/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, notes }),
    });

    const data = await res.json();
    setA(data.data?.answer || data.answer);
  };

  return (
    <div className="bg-[#141416] p-5 rounded-2xl border border-orange-500/20 mt-6">
      <h3 className="mb-3 font-semibold">Ask a question</h3>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full p-3 bg-black rounded-xl mb-3"
        placeholder="Ask from this notebook..."
      />

      <button
        onClick={ask}
        className="bg-[#ff7a00] text-black px-4 py-2 rounded-xl"
      >
        Ask
      </button>

      {a && <p className="mt-4 text-gray-300">{a}</p>}
    </div>
  );
}
