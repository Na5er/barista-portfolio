"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  // Hide the tap-to-play button (e.g. when it sits behind other content); the video still retries on first touch.
  hideButton?: boolean;
};

/**
 * Mobile-safe video: inline, muted, looping autoplay, first frame visible on iOS,
 * and a tap-to-play overlay whenever the browser blocks autoplay (low-power mode, data saver, etc.).
 */
export default function SmartVideo({ src, poster, className = "", controls = false, preload = "metadata", hideButton = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  const play = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // React does not reliably reflect the muted prop to the DOM, and autoplay requires it
    v.play().then(() => setPaused(false)).catch(() => setPaused(true));
  }, []);

  useEffect(() => {
    play();
    // Blocked autoplay is usually allowed after the first user gesture anywhere on the page.
    const retry = () => { if (ref.current?.paused) play(); };
    window.addEventListener("touchstart", retry, { once: true, passive: true });
    window.addEventListener("click", retry, { once: true });
    return () => { window.removeEventListener("touchstart", retry); window.removeEventListener("click", retry); };
  }, [play, src]);

  return (
    <>
      <video
        ref={ref}
        // #t=0.001 makes iOS Safari render the first frame instead of a black box when only metadata is loaded
        src={src.includes("#") ? src : `${src}#t=0.001`}
        poster={poster}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload={preload}
        controls={controls}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onPlaying={() => setPaused(false)}
      />
      {paused && !hideButton && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); play(); }}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/25 focus:outline-none"
        >
          <span className="w-16 h-16 rounded-full bg-amber/90 text-black flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-7 h-7 ms-1 rtl:-scale-x-100" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}
    </>
  );
}
