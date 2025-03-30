/**
 * 現在の誕生日を基準に年齢を計算する関数
 *
 * @param birthday 誕生日
 * @param currentDate 現在の日付
 * @returns 年齢
 */
export function calcAge(birthday: Date, currentDate: Date): number {
  const diff = currentDate.getTime() - birthday.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
