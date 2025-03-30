export function calcAge(birthday: Date, currentDate: Date): number {
  const diff = currentDate.getTime() - birthday.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
