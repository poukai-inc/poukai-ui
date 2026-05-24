import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { VisuallyHidden } from "../../atoms/VisuallyHidden/VisuallyHidden";
import styles from "./Carousel.module.css";

/* ------------------------------------------------------------------ */
/* Context                                                              */
/* ------------------------------------------------------------------ */

interface CarouselContextValue {
  activeIndex: number;
  slideCount: number;
  loop: boolean;
  goTo: (index: number) => void;
  prev: () => void;
  next: () => void;
  trackRef: React.RefObject<HTMLUListElement | null>;
  baseId: string;
  registerSlide: () => number;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error("Carousel sub-components must be used inside <Carousel.Root>.");
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export interface CarouselRootProps extends ComponentPropsWithoutRef<"section"> {
  /** Auto-advance slides. Off by default; always disabled under prefers-reduced-motion. */
  autoplay?: boolean;
  /** Wrap-around navigation. Off by default. */
  loop?: boolean;
  /** Number of visible slides. Default 1. */
  slidesVisible?: number;
  /** Inter-slide gap inside the track. Defaults to --space-4. */
  gap?: string;
  /** Show dot indicators. Default true. */
  indicators?: boolean;
  children: ReactNode;
}

export interface CarouselSlideProps extends ComponentPropsWithoutRef<"li"> {
  children: ReactNode;
}

export interface CarouselPrevProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "aria-label"
> {
  "aria-label"?: string;
}

export interface CarouselNextProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "aria-label"
> {
  "aria-label"?: string;
}

export type CarouselIndicatorsProps = ComponentPropsWithoutRef<"div">;

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */

const AUTOPLAY_INTERVAL = 4000;

const CarouselRoot = forwardRef<HTMLElement, CarouselRootProps>(function CarouselRoot(
  {
    autoplay = false,
    loop = false,
    slidesVisible: _slidesVisible = 1,
    gap,
    indicators: _indicators = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // slideCount is tracked via a counter incremented by each Slide on mount.
  const slideCountRef = useRef(0);
  const [slideCount, setSlideCount] = useState(0);

  const registerSlide = useCallback(() => {
    const idx = slideCountRef.current;
    slideCountRef.current += 1;
    setSlideCount(slideCountRef.current);
    return idx;
  }, []);

  const scrollTrackTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollTrackTo(index);
    },
    [scrollTrackTo],
  );

  const prev = useCallback(() => {
    setActiveIndex((cur) => {
      const next = cur <= 0 ? (loop ? slideCount - 1 : 0) : cur - 1;
      scrollTrackTo(next);
      return next;
    });
  }, [loop, slideCount, scrollTrackTo]);

  const next = useCallback(() => {
    setActiveIndex((cur) => {
      const next = cur >= slideCount - 1 ? (loop ? 0 : slideCount - 1) : cur + 1;
      scrollTrackTo(next);
      return next;
    });
  }, [loop, slideCount, scrollTrackTo]);

  /* Autoplay -------------------------------------------------------- */
  const isHovered = useRef(false);
  const isFocused = useRef(false);

  useEffect(() => {
    if (!autoplay || slideCount === 0) return;
    // Respect prefers-reduced-motion — do not start timer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = () => {
      if (isHovered.current || isFocused.current) return;
      setActiveIndex((cur) => {
        const next = cur >= slideCount - 1 ? (loop ? 0 : cur) : cur + 1;
        scrollTrackTo(next);
        return next;
      });
    };

    const id = window.setInterval(tick, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [autoplay, loop, slideCount, scrollTrackTo]);

  const handleMouseEnter = useCallback(() => {
    isHovered.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
  }, []);
  const handleFocusIn = useCallback(() => {
    isFocused.current = true;
  }, []);
  const handleFocusOut = useCallback(() => {
    isFocused.current = false;
  }, []);

  /* Scroll-based active index sync ----------------------------------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => {
      const { scrollLeft, clientWidth } = track;
      if (clientWidth === 0) return;
      const idx = Math.round(scrollLeft / clientWidth);
      setActiveIndex(idx);
    };
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  const gapValue = gap ?? "var(--space-4)";

  return (
    <CarouselContext.Provider
      value={{ activeIndex, slideCount, loop, goTo, prev, next, trackRef, baseId, registerSlide }}
    >
      <section
        ref={ref as React.Ref<HTMLElement>}
        aria-roledescription="carousel"
        className={clsx(styles.root, className)}
        style={{ "--carousel-gap": gapValue } as React.CSSProperties}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={handleFocusIn}
        onBlurCapture={handleFocusOut}
        {...rest}
      >
        {children}
        {/* Live region for screen-reader slide announcements */}
        <VisuallyHidden as="div" aria-live="polite" aria-atomic="true">
          {slideCount > 0 ? `Slide ${activeIndex + 1} of ${slideCount}` : ""}
        </VisuallyHidden>
      </section>
    </CarouselContext.Provider>
  );
});

CarouselRoot.displayName = "Carousel.Root";

/* ------------------------------------------------------------------ */
/* Track (internal — exposed as Carousel.Track)                        */
/* ------------------------------------------------------------------ */

export interface CarouselTrackProps extends ComponentPropsWithoutRef<"ul"> {
  children: ReactNode;
}

const CarouselTrack = forwardRef<HTMLUListElement, CarouselTrackProps>(function CarouselTrack(
  { className, children, ...rest },
  ref,
) {
  const { trackRef } = useCarousel();

  const setRef = useCallback(
    (node: HTMLUListElement | null) => {
      (trackRef as React.MutableRefObject<HTMLUListElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = node;
    },
    [trackRef, ref],
  );

  return (
    // Spec §6: axe scrollable-region-focusable requires tabIndex={0} on the scrollable track.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <ul ref={setRef} className={clsx(styles.track, className)} tabIndex={0} {...rest}>
      {children}
    </ul>
  );
});

CarouselTrack.displayName = "Carousel.Track";

/* ------------------------------------------------------------------ */
/* Slide                                                                */
/* ------------------------------------------------------------------ */

const CarouselSlide = forwardRef<HTMLLIElement, CarouselSlideProps>(function CarouselSlide(
  { className, children, ...rest },
  ref,
) {
  const { baseId, slideCount, registerSlide } = useCarousel();
  // Each slide registers itself on first render to get its index.
  const indexRef = useRef<number | null>(null);
  if (indexRef.current === null) {
    indexRef.current = registerSlide();
  }
  const slideIndex = indexRef.current;
  const total = slideCount;
  const slideId = `${baseId}-slide-${slideIndex}`;

  return (
    <li
      ref={ref}
      id={slideId}
      aria-roledescription="slide"
      aria-label={`Slide ${slideIndex + 1} of ${total}`}
      className={clsx(styles.slide, className)}
      {...rest}
    >
      {children}
    </li>
  );
});

CarouselSlide.displayName = "Carousel.Slide";

/* ------------------------------------------------------------------ */
/* Prev                                                                 */
/* ------------------------------------------------------------------ */

const CarouselPrev = forwardRef<HTMLButtonElement, CarouselPrevProps>(function CarouselPrev(
  { "aria-label": ariaLabel = "Previous slide", className, ...rest },
  ref,
) {
  const { prev, activeIndex, loop } = useCarousel();
  const isDisabled = !loop && activeIndex <= 0;

  return (
    <IconButton
      ref={ref}
      icon={ChevronLeft}
      aria-label={ariaLabel}
      variant="ghost"
      size="md"
      className={clsx(styles.navBtn, styles.prevBtn, className)}
      onClick={prev}
      disabled={isDisabled}
      aria-disabled={isDisabled ? "true" : undefined}
      {...rest}
    />
  );
});

CarouselPrev.displayName = "Carousel.Prev";

/* ------------------------------------------------------------------ */
/* Next                                                                 */
/* ------------------------------------------------------------------ */

const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>(function CarouselNext(
  { "aria-label": ariaLabel = "Next slide", className, ...rest },
  ref,
) {
  const { next, activeIndex, slideCount, loop } = useCarousel();
  const isDisabled = !loop && activeIndex >= slideCount - 1;

  return (
    <IconButton
      ref={ref}
      icon={ChevronRight}
      aria-label={ariaLabel}
      variant="ghost"
      size="md"
      className={clsx(styles.navBtn, styles.nextBtn, className)}
      onClick={next}
      disabled={isDisabled}
      aria-disabled={isDisabled ? "true" : undefined}
      {...rest}
    />
  );
});

CarouselNext.displayName = "Carousel.Next";

/* ------------------------------------------------------------------ */
/* Indicators                                                           */
/* ------------------------------------------------------------------ */

const CarouselIndicators = forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  function CarouselIndicators({ className, ...rest }, ref) {
    const { slideCount, activeIndex, goTo, baseId } = useCarousel();

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(activeIndex <= 0 ? slideCount - 1 : activeIndex - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(activeIndex >= slideCount - 1 ? 0 : activeIndex + 1);
        }
      },
      [activeIndex, slideCount, goTo],
    );

    if (slideCount === 0) return null;

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Slide indicators"
        tabIndex={-1}
        className={clsx(styles.indicators, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {Array.from({ length: slideCount }, (_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Slide ${i + 1} of ${slideCount}`}
            aria-controls={`${baseId}-slide-${i}`}
            className={clsx(styles.dot, i === activeIndex && styles.dotActive)}
            onClick={() => goTo(i)}
            tabIndex={i === activeIndex ? 0 : -1}
            type="button"
          />
        ))}
      </div>
    );
  },
);

CarouselIndicators.displayName = "Carousel.Indicators";

/* ------------------------------------------------------------------ */
/* Compound export                                                      */
/* ------------------------------------------------------------------ */

export const Carousel = Object.assign(CarouselRoot, {
  Root: CarouselRoot,
  Track: CarouselTrack,
  Slide: CarouselSlide,
  Prev: CarouselPrev,
  Next: CarouselNext,
  Indicators: CarouselIndicators,
});
