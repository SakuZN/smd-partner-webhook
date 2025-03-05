import { DateTime } from "luxon";

export function formatStringDate(date: string): string {
  return DateTime.fromISO(date).setZone("Asia/Manila").toLocaleString(DateTime.DATETIME_FULL);
}