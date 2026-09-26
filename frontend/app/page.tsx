// Layout wrapper, composing of the custom hook and the isolated UI components 

'use client';

import { useIdeas } from '../hooks/useIdeas';
import IdeaForm from '../components/IdeaForm';
import IdeaList from '../components/IdeaList';

export default function Home() {
  const { ideas, upvoteIdea, onlineCount } = useIdeas();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        
        {/* Core Presence Indicator */}
        <div className="flex justify-end mb-4">
          <span className="flex items-center gap-2 text-sm bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {onlineCount} {onlineCount === 1 ? 'User' : 'Users'} Online
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">Fincorp Idea Board</h1>
        <p className="text-slate-400 text-center mb-8">
          Real-time collaborative workspace with strict scope control
        </p>

        <IdeaForm />
        <IdeaList ideas={ideas} onUpvote={upvoteIdea} />
      </div>
    </main>
  );
}