export function validateCourse(aiData) {
  if (!Array.isArray(aiData.chapters))
    throw new Error("Invalid chapters format");

  aiData.chapters.forEach((chapter, ci) => {
    if (!chapter.topics || chapter.topics.length < 4) {
      throw new Error(`Chapter ${ci + 1} has insufficient topics`);
    }

    chapter.topics.forEach((topic, ti) => {
      if (!topic.content || topic.content.length < 12) {
        throw new Error(`Topic "${topic.title}" is too shallow`);
      }

      const requiredSections = [
        "Introduction",
        "Why This Concept Is Important",
        "Syntax and Explanation",
        "Example",
        "Output",
        "Key Takeaways",
      ];

      const headings = topic.content
        .filter((c) => c.type === "heading")
        .map((c) => c.text);

      requiredSections.forEach((section) => {
        if (!headings.includes(section)) {
          throw new Error(
            `Missing section "${section}" in topic "${topic.title}"`
          );
        }
      });
    });
  });
}
