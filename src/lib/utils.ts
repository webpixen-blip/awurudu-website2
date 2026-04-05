import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AVURUDU_THEME = {
  primary: 'bg-[#8B0000]', // Deep Red
  secondary: 'bg-[#FFD700]', // Gold
  accent: 'text-[#FFD700]',
  card: 'bg-[#A52A2A]', // Brownish Red
  text: 'text-white',
};
