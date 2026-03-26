import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
  return typeof url === 'string' ? url : url.url;
}

export const getImageUrl = (
  path: string | null | undefined,
  type: 'avatar' | 'logo' = 'logo',
) => {
  if (!path) {
    return type == 'logo'
      ? '/storage/assets/images/generic_logo.png'
      : '/storage/assets/images/generic_avatar.png';
  }
  if (path.startsWith('http')) return path; // Absolute URL
  return `/storage/${path}`;
};
