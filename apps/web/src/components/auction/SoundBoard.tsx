"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Clip {
  /** filename (without extension) under /public/auction/sfx/ */
  file: string;
  label: string;
  emoji: string;
}

// Files live at: public/auction/sfx/<file>.mp3
const CLIPS: Clip[] = [
  { file: "come-on-in", label: "Come on in, guys!", emoji: "📣" },
  { file: "playing-for", label: "Wanna know what you're playing for?", emoji: "💰" },
  { file: "survivors-ready", label: "Survivors ready…", emoji: "⏳" },
  { file: "go", label: "GO!", emoji: "🏁" },
  { file: "wow", label: "Wow!", emoji: "😮" },
  { file: "applause", label: "Applause", emoji: "👏" },
  { file: "tribe-has-spoken", label: "The tribe has spoken", emoji: "🔥" },
];

export default function SoundBoard({
  themeRef,
}: {
  /** The theme-music <audio>, so we can duck its volume while a clip plays. */
  themeRef: RefObject<HTMLAudioElement | null>;
}) {
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const [playing, setPlaying] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const activeRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(
    (clip: Clip) => {
      // Stop any clip already playing so they don't pile up.
      if (activeRef.current) {
        activeRef.current.pause();
        activeRef.current = null;
      }

      const audio = new Audio(`/auction/sfx/${clip.file}.mp3`);
      audio.volume = 1;
      activeRef.current = audio;

      // Duck the theme music while the clip plays.
      const theme = themeRef.current;
      const ducking = theme && !theme.paused;
      const prevVol = theme?.volume ?? 0.6;
      if (ducking && theme) theme.volume = 0.12;

      const restore = () => {
        if (ducking && theme) theme.volume = prevVol;
        if (activeRef.current === audio) activeRef.current = null;
        setPlaying((p) => (p === clip.file ? null : p));
      };

      audio.addEventListener("ended", restore);
      audio.addEventListener("error", () => {
        restore();
        setMissing((m) => new Set(m).add(clip.file));
      });

      audio
        .play()
        .then(() => {
          setPlaying(clip.file);
          setMissing((m) => {
            if (!m.has(clip.file)) return m;
            const next = new Set(m);
            next.delete(clip.file);
            return next;
          });
        })
        .catch(() => {
          restore();
          setMissing((m) => new Set(m).add(clip.file));
        });
    },
    [themeRef],
  );

  return (
    <section className="tw-mb-8 tw-overflow-hidden tw-rounded-2xl tw-border tw-border-orange-500/20 tw-bg-black/40 tw-backdrop-blur">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="tw-flex tw-w-full tw-items-center tw-justify-center tw-gap-2 tw-px-4 tw-py-3 tw-text-xs tw-font-bold tw-uppercase tw-tracking-[0.4em] tw-text-orange-300/80 hover:tw-text-orange-200"
      >
        🎙️ Jeff&apos;s Soundboard
        <span
          className={`tw-transition-transform tw-duration-200 ${open ? "tw-rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="tw-overflow-hidden"
          >
            <div className="tw-px-4 tw-pb-4">
              <div className="tw-grid tw-grid-cols-2 tw-gap-2 sm:tw-grid-cols-3 lg:tw-grid-cols-3">
                {CLIPS.map((clip) => {
                  const isMissing = missing.has(clip.file);
                  const isPlaying = playing === clip.file;
                  return (
                    <button
                      key={clip.file}
                      onClick={() => play(clip)}
                      title={
                        isMissing ? `Missing: /auction/sfx/${clip.file}.mp3` : clip.label
                      }
                      className={`tw-flex tw-items-center tw-gap-2 tw-rounded-xl tw-border tw-px-3 tw-py-2.5 tw-text-left tw-text-sm tw-font-semibold tw-transition-colors ${
                        isPlaying
                          ? "torch-lit tw-border-orange-400 tw-bg-gradient-to-b tw-from-orange-500/40 tw-to-red-700/40 tw-text-orange-50"
                          : "tw-border-orange-500/30 tw-bg-orange-950/30 tw-text-orange-100 hover:tw-bg-orange-900/50"
                      } ${isMissing ? "tw-opacity-50" : ""}`}
                    >
                      <span className="tw-text-lg tw-leading-none">{clip.emoji}</span>
                      <span className="tw-min-w-0 tw-flex-1 tw-truncate">{clip.label}</span>
                    </button>
                  );
                })}
              </div>

              {missing.size > 0 && (
                <p className="tw-mt-3 tw-text-center tw-text-xs tw-text-orange-300/70">
                  Missing clips highlighted above — add them at{" "}
                  <code className="tw-text-orange-200">
                    public/auction/sfx/&lt;name&gt;.mp3
                  </code>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
