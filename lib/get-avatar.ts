/**
 * Selects a user's avatar URL, preferring the provided picture and falling back to a generated Vercel avatar.
 *
 * @param userPicture - The explicit avatar URL, or `null` if none is provided
 * @param userEmail - Email used to generate the fallback avatar URL
 * @returns The `userPicture` if it is not `null`, otherwise `https://avatar.vercel.sh/${userEmail}`
 */
export function getAvatar(userPicture: string | null, userEmail: string) {
  return userPicture ?? `https://avatar.vercel.sh/${userEmail}`;
}