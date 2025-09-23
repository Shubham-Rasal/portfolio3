/**
 * Format a date into a human-readable format
 * Examples: "5th July 2025", "22nd June 2025", "1st January 2025"
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const d = new Date(date);
  
  // Get day with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const day = d.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  
  // Get month name and year
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const year = d.getFullYear();
  
  return `${day}${ordinalSuffix} ${month} ${year}`;
}

/**
 * Get ordinal suffix for a number (st, nd, rd, th)
 * @param num - The number to get suffix for
 * @returns The ordinal suffix
 */
function getOrdinalSuffix(num: number): string {
  const mod10 = num % 10;
  const mod100 = num % 100;
  
  if (mod100 >= 11 && mod100 <= 13) {
    return 'th';
  }
  
  switch (mod10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Format a date using medium style (for backward compatibility)
 * Examples: "Jul 5, 2025", "Jun 22, 2025"
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateMedium(date: Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(d);
}