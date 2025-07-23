/**
 * Custom hook to scroll to top of the page
 * Used to ensure proper scroll position when navigating between pages
 */

export function useScrollTop() {
  const scrollToTop = (behavior: ScrollBehavior = 'auto') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  };

  return scrollToTop;
}