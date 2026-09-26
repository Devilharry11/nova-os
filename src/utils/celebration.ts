export const triggerFireworks = (x?: number, y?: number) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('trigger-heart-fireworks', {
        detail: { x, y },
      })
    );
  }
};
