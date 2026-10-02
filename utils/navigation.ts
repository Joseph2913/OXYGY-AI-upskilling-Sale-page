/** Hash for the Upskilling page, which hosts the five-level framework sections. */
export const UPSKILLING_HASH = '#upskilling';

const SCROLL_DELAY_MS = 100;

/** Navigate to the Upskilling page and scroll to a section on it (e.g. 'journey'). */
export function goToUpskillingSection(sectionId: string): void {
  window.location.hash = UPSKILLING_HASH;
  setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }, SCROLL_DELAY_MS);
}
