/**
 * Extract a clean text excerpt from markdown content
 * @param content - The markdown content
 * @param maxLength - Maximum length of the excerpt (default: 150)
 * @returns Clean text excerpt
 */
export function extractExcerpt(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  // Remove markdown syntax and HTML tags
  let cleanText = content
    // Remove frontmatter (if any somehow got through)
    .replace(/^---[\s\S]*?---/, '')
    // Remove markdown headers
    .replace(/^#+\s+/gm, '')
    // Remove markdown links but keep text [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown emphasis
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown lists
    .replace(/^[\s]*[-*+]\s+/gm, '')
    // Remove numbered lists
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Clean up multiple newlines
    .replace(/\n\s*\n/g, ' ')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate to maxLength and add ellipsis if needed
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Find the last complete word within the limit
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    // If we have a reasonably long text before the last space, cut there
    return cleanText.substring(0, lastSpaceIndex) + '...';
  } else {
    // Otherwise, cut at the maxLength
    return truncated + '...';
  }
}