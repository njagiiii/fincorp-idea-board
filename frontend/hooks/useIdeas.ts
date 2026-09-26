// This encapsulate all the supabase fetching, eal time web-socket sub and upvoting logic 

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Idea } from '../types';
import { generateAnonymousId } from '@/lib/utils';

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(1);

  useEffect(() => {
    // 1. Fetch initial ideas
    const fetchIdeas = async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('upvotes', { ascending: false });

      if (!error && data) setIdeas(data);
    };

    fetchIdeas();

    // 2. Generate the anonymous user ID locally (Client-side only)
    const userId = generateAnonymousId();

    // 3. Create a single channel for both DB changes and Presence tracking
    const channel = supabase.channel('board-room', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      // Listen for database inserts and updates
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ideas' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIdeas((prev) => [payload.new as Idea, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setIdeas((prev) =>
              prev.map((idea) =>
                idea.id === payload.new.id ? (payload.new as Idea) : idea
              )
            );
          }
        }
      )
      // Listen for users joining or leaving to calculate presence
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Broadcast this user's presence to everyone else
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const upvoteIdea = async (id: string) => {
    const { error } = await supabase.rpc('increment_upvote', { idea_id: id });
    if (error) console.error('Error upvoting:', error);
  };

  return { ideas, upvoteIdea, onlineCount };
}