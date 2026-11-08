export type BoardSort = "newest" | "oldest";
export const BOARD_TOPIC_OPTIONS = ["Sexual abuse", "Physical abuse", "Emotional / verbal abuse", "Financial abuse", "Neglect", "Abandonment", "Coercive control", "Stalking / harassment", "Childhood abuse", "Trafficking / exploitation", "Spiritual / religious abuse", "Other"];
type BrowseStory = { id: string; topics: string[]; shared_at: string | null; created_at: string };

export function storyDate(story: Pick<BrowseStory, "shared_at" | "created_at">) {
  return story.shared_at || story.created_at;
}

export function boardTopics(stories: BrowseStory[]) {
  return [...new Set([...BOARD_TOPIC_OPTIONS, ...stories.flatMap((story) => story.topics)])].sort((a, b) => a.localeCompare(b));
}

export function browseStories<T extends BrowseStory>(stories: T[], topics: string[], sort: BoardSort): T[] {
  return stories.filter((story) => !topics.length || topics.some((topic) => story.topics.includes(topic)))
    .sort((a, b) => {
      const difference = Date.parse(storyDate(a)) - Date.parse(storyDate(b));
      return (sort === "newest" ? -difference : difference) || a.id.localeCompare(b.id);
    });
}