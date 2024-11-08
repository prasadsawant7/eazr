export function formatDate(date: Date): string {
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
  return formattedDate;
}
