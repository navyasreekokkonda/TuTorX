/**
 * ClassName merger utility.
 * Concatenates conditional class names cleanly without template literal clutter.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
