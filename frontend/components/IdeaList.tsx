
// Component that receives data and function as props 

// frontend/components/IdeaList.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Idea } from '../types';

interface IdeaListProps {
  ideas: Idea[];
  onUpvote: (id: string) => void;
}

export default function IdeaList({ ideas, onUpvote }: IdeaListProps) {
  if (ideas.length === 0) {
    return <p className="text-center text-slate-600">No ideas yet. Be the first to post!</p>;
  }

  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence>
        {ideas.map((idea) => (
          <motion.div
            key={idea.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow"
          >
            <p className="text-slate-200 pr-4 break-words flex-1">{idea.text}</p>
            <button
              onClick={() => onUpvote(idea.id)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition text-indigo-400 font-semibold"
            >
              <span>▲</span>
              <motion.span
                key={idea.upvotes}
                initial={{ scale: 1.5, color: '#818cf8' }}
                animate={{ scale: 1, color: '#6366f1' }}
                className="inline-block"
              >
                {idea.upvotes}
              </motion.span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}