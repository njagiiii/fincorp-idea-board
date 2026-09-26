// Typescript definitions
export interface Idea {
    id: string;
    text: string;
    upvotes: number;
    created_at: string
}

export interface IdeaListProps {
  ideas: Idea[];
  onUpvote: (id: string) => void;
}