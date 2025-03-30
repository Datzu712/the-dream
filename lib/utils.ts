import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single className string.
 * This utility uses clsx for conditional class concatenation and twMerge for Tailwind CSS class deduplication.
 *
 * @param inputs - The class values to be combined. Can include strings, objects, arrays, etc. as supported by clsx.
 * @returns A merged className string with Tailwind CSS class conflicts resolved.
 *
 * @example
 * ```tsx
 * <div className={cn('bg-red-500', 'bg-blue-500', 'text-white')}>
 *   Content
 * </div>
 *
 * ```
 *
 * Resolves to:
 * ```tsx
 * <div className="bg-blue-500 text-white">
 *  Content
 * </div>
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
