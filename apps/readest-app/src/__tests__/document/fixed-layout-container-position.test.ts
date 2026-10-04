import { describe, expect, it } from 'vitest';

// Importing the module registers the <foliate-fxl> custom element.
import 'foliate-js/fixed-layout.js';

describe('fixed-layout containerPosition (READEST-11)', () => {
  const FixedLayout = customElements.get('foliate-fxl');

  it('registers the custom element', () => {
    expect(FixedLayout).toBeTruthy();
  });

  it('exposes a writable containerPosition for scrolled fixed-layout autoscroll', () => {
    const descriptor = Object.getOwnPropertyDescriptor(FixedLayout!.prototype, 'containerPosition');
    expect(typeof descriptor?.get).toBe('function');
    // Auto Scroll / middle-click autoscroll do `renderer.containerPosition += delta`
    // in scrolled mode. A getter-only property crashed on the write for PDF / CBZ /
    // fixed-EPUB books in scrolled mode (READEST-11); the setter must exist.
    expect(typeof descriptor?.set).toBe('function');
  });

  it('exposes a writable subpixelOffset for smooth scrolled auto scroll', () => {
    const descriptor = Object.getOwnPropertyDescriptor(FixedLayout!.prototype, 'subpixelOffset');
    expect(typeof descriptor?.get).toBe('function');
    // PacedScroller reports its fractional remainder via onSubpixel every frame
    // (useAutoScroll). Without a setter the write lands on a dead expando and
    // PDF / CBZ / fixed-EPUB books in scrolled mode advance in whole-pixel
    // steps only (1px jump every ~50ms at 20px/s, every 200ms at min speed) —
    // the visible judder. Must mirror the paginator's scrollport-transform
    // contract, on the host itself rather than .scroll-container (readest#5663).
    expect(typeof descriptor?.set).toBe('function');
  });

  it('observes scroll-direction for horizontal scroll mode (readest#4995)', () => {
    const observed = (FixedLayout as unknown as { observedAttributes: string[] })
      .observedAttributes;
    expect(observed).toContain('scroll-direction');
  });
});
