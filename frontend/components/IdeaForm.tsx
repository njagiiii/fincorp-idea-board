
// Handles specific logic for talking to the Flask API

import { useState } from 'react';

export default function IdeaForm() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

//   Submit Handler
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');

// API request
    try {
      const res = await fetch('http://localhost:5000/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      setText('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-8 shadow-lg">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={200}
        placeholder="Share an idea (max 200 characters)..."
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-24"
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-slate-500">{200 - text.length} characters left</span>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Post Idea'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </form>
  );
}