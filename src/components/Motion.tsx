'use client';

import { useEffect } from 'react';
import { startMotion } from '@/lib/motion/engine';

/** Starts the scroll-linked motion (and, on the home page, the globe) once the page is interactive. */
export function Motion() {
  useEffect(() => startMotion(), []);
  return null;
}
