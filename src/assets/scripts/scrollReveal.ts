// Animación sutil de aparición al hacer scroll para bloques marcados con
// [data-reveal] (por defecto, los encabezados de sección — ver SectionHeading.astro).
// Respeta prefers-reduced-motion (sección 46 de la especificación): si el
// usuario lo activa, el contenido se muestra directamente sin animar.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveal(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-bound])');

  targets.forEach((el) => {
    el.setAttribute('data-reveal-bound', 'true');

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      },
    );
  });
}
