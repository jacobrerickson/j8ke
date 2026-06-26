"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  AuctionStorage,
  type Contestant,
  type ContestantType,
  type AuctionSettings,
} from "@/lib/auction/storage";
import SoundBoard from "@/components/auction/SoundBoard";

const ADULT_QUICK_SPENDS = [20, 50, 100, 200];
const KID_QUICK_SPENDS = [5, 10, 20, 50];

function formatMoney(n: number): string {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString("en-US");
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const IMG_EXTS = ["jpg", "jpeg", "png", "webp"] as const;

/**
 * Photo paths to try, in order. Lets you drop a .png (or .webp) even when the
 * roster default points at .jpg — the card falls through to the next extension.
 */
function photoCandidates(photo: string): string[] {
  if (!photo) return [];
  const m = photo.match(/^(.*)\.(jpg|jpeg|png|webp)$/i);
  if (!m) return [photo];
  const base = m[1]!;
  const used = m[2]!.toLowerCase();
  return [photo, ...IMG_EXTS.filter((e) => e !== used).map((e) => `${base}.${e}`)];
}

/** Floating embers rendered once on mount with stable randomized values. */
function Embers() {
  const embers = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const size = 3 + Math.round(Math.random() * 7);
        return {
          id: i,
          left: Math.random() * 100,
          size,
          duration: 6 + Math.random() * 8,
          delay: Math.random() * 8,
          drift: (Math.random() * 120 - 60).toFixed(0) + "px",
        };
      }),
    [],
  );

  return (
    <div className="tw-pointer-events-none tw-absolute tw-inset-0 tw-overflow-hidden">
      {embers.map((e) => (
        <span
          key={e.id}
          className="ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            ["--ember-drift" as string]: e.drift,
          }}
        />
      ))}
    </div>
  );
}

interface DraftState {
  open: boolean;
  editingId: string | null;
  name: string;
  type: ContestantType;
  photo: string;
  startingBudget: string;
}

const EMPTY_DRAFT: DraftState = {
  open: false,
  editingId: null,
  name: "",
  type: "adult",
  photo: "",
  startingBudget: "",
};

export default function AuctionBoard() {
  const [hydrated, setHydrated] = useState(false);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [settings, setSettings] = useState<AuctionSettings>({
    adultBudget: 500,
    kidBudget: 250,
  });
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [musicOn, setMusicOn] = useState(false);
  const [musicMissing, setMusicMissing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load from localStorage on mount.
  useEffect(() => {
    setContestants(AuctionStorage.getContestants());
    setSettings(AuctionStorage.getSettings());
    setHydrated(true);
  }, []);

  // Persist whenever data changes (after hydration so we don't clobber storage).
  useEffect(() => {
    if (hydrated) AuctionStorage.setContestants(contestants);
  }, [contestants, hydrated]);

  useEffect(() => {
    if (hydrated) AuctionStorage.setSettings(settings);
  }, [settings, hydrated]);

  const totals = useMemo(() => {
    const remaining = contestants.reduce((s, c) => s + c.balance, 0);
    const starting = contestants.reduce((s, c) => s + c.startingBudget, 0);
    return { remaining, starting, spent: starting - remaining };
  }, [contestants]);

  // ----- mutations -----
  function updateBalance(id: string, delta: number) {
    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, balance: c.balance + delta } : c)),
    );
  }

  function setBalance(id: string, value: number) {
    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, balance: value } : c)),
    );
  }

  // Set a player's whole pot (e.g. their challenge winnings) — both the
  // starting budget and current balance, so "spent" and reset stay accurate.
  function setPot(id: string, value: number) {
    setContestants((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, startingBudget: value, balance: value } : c,
      ),
    );
  }

  function resetToBudget(id: string) {
    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, balance: c.startingBudget } : c)),
    );
  }

  function removeContestant(id: string) {
    const c = contestants.find((x) => x.id === id);
    if (c && !window.confirm(`Remove ${c.name || "this contestant"}?`)) return;
    setContestants((prev) => prev.filter((x) => x.id !== id));
  }

  function resetAll() {
    if (!window.confirm("Reset everyone's balance back to their starting budget?")) return;
    setContestants((prev) => prev.map((c) => ({ ...c, balance: c.startingBudget })));
  }

  function restoreDefaults() {
    if (
      !window.confirm(
        "Restore the default players? This replaces the current roster.",
      )
    )
      return;
    setContestants(AuctionStorage.getDefaultRoster());
  }

  function budgetFor(type: ContestantType) {
    return type === "kid" ? settings.kidBudget : settings.adultBudget;
  }

  function openAdd() {
    setDraft({
      open: true,
      editingId: null,
      name: "",
      type: "adult",
      photo: "",
      startingBudget: String(settings.adultBudget),
    });
  }

  function openEdit(c: Contestant) {
    setDraft({
      open: true,
      editingId: c.id,
      name: c.name,
      type: c.type,
      photo: c.photo,
      startingBudget: String(c.startingBudget),
    });
  }

  function saveDraft() {
    const name = draft.name.trim();
    if (!name) return;
    const budget = Math.max(0, Math.round(Number(draft.startingBudget) || 0));
    const photo = draft.photo.trim();

    if (draft.editingId) {
      setContestants((prev) =>
        prev.map((c) =>
          c.id === draft.editingId
            ? { ...c, name, type: draft.type, photo, startingBudget: budget }
            : c,
        ),
      );
    } else {
      setContestants((prev) => [
        ...prev,
        {
          id: AuctionStorage.newId(),
          name,
          type: draft.type,
          photo,
          startingBudget: budget,
          balance: budget,
        },
      ]);
    }
    setDraft(EMPTY_DRAFT);
  }

  // ----- music -----
  function toggleMusic() {
    const el = audioRef.current;
    if (!el) return;
    if (musicOn) {
      el.pause();
      setMusicOn(false);
    } else {
      el.volume = 0.6;
      el.play()
        .then(() => {
          setMusicOn(true);
          setMusicMissing(false);
        })
        .catch(() => setMusicMissing(true));
    }
  }

  return (
    <div className="tw-relative tw-min-h-screen tw-overflow-hidden tw-bg-[#0a0500] tw-text-orange-50">
      {/* Background layers */}
      <div className="tw-pointer-events-none tw-absolute tw-inset-0 tw-bg-[radial-gradient(120%_80%_at_50%_120%,rgba(255,90,0,0.45)_0%,rgba(120,20,0,0.25)_35%,rgba(10,5,0,0)_70%)]" />
      <div className="fire-base tw-pointer-events-none tw-absolute tw-inset-x-0 tw-bottom-0 tw-h-48 tw-bg-[linear-gradient(0deg,rgba(255,120,0,0.5)_0%,rgba(255,60,0,0.15)_50%,transparent_100%)] tw-blur-xl" />
      <Embers />

      {/* Hidden audio element — drop a file at /public/auction/survivor-theme.mp3 */}
      <audio ref={audioRef} src="/auction/survivor-theme.mp3" loop preload="none" />

      <div className="tw-relative tw-z-10 tw-mx-auto tw-max-w-7xl tw-px-4 tw-py-10 sm:tw-px-6 lg:tw-px-8">
        {/* Header */}
        <header className="tw-mb-8 tw-text-center">
          <h1 className="fire-text tw-text-5xl tw-font-black tw-uppercase tw-tracking-tight sm:tw-text-7xl">
            Survivor Auction
          </h1>
          <p className="tw-mt-3 tw-text-lg tw-font-semibold tw-italic tw-text-orange-200/80">
            In The Hands of the Fam
          </p>

          <div className="tw-mt-5 tw-flex tw-items-center tw-justify-center">
            <button
              onClick={toggleMusic}
              className={`tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-orange-500/40 tw-bg-black/40 tw-px-5 tw-py-2 tw-text-sm tw-font-semibold tw-text-orange-100 tw-backdrop-blur hover:tw-bg-black/60 ${
                musicOn ? "torch-lit tw-border-orange-400" : ""
              }`}
            >
              <span className="tw-text-lg">{musicOn ? "🔥" : "🎵"}</span>
              {musicOn ? "Theme playing" : "Play theme music"}
            </button>
          </div>
          {musicMissing && (
            <p className="tw-mt-2 tw-text-xs tw-text-orange-300/80">
              No theme file found — add one at{" "}
              <code className="tw-text-orange-200">
                public/auction/survivor-theme.mp3
              </code>
            </p>
          )}
        </header>

        {/* Soundboard */}
        <SoundBoard themeRef={audioRef} />

        {/* Control bar */}
        <div className="tw-mb-8 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-3 tw-rounded-2xl tw-border tw-border-orange-500/20 tw-bg-black/40 tw-p-4 tw-backdrop-blur">
          <label className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-orange-200/90">
            Adult budget
            <span className="tw-text-orange-400">$</span>
            <input
              type="number"
              min={0}
              value={settings.adultBudget}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  adultBudget: Math.max(0, Math.round(Number(e.target.value) || 0)),
                }))
              }
              className="tw-w-24 tw-rounded-lg tw-border tw-border-orange-500/30 tw-bg-black/50 tw-px-3 tw-py-1.5 tw-text-orange-50 focus:tw-border-orange-400 focus:tw-outline-none"
            />
          </label>

          <label className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-orange-200/90">
            Kid budget
            <span className="tw-text-orange-400">$</span>
            <input
              type="number"
              min={0}
              value={settings.kidBudget}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  kidBudget: Math.max(0, Math.round(Number(e.target.value) || 0)),
                }))
              }
              className="tw-w-24 tw-rounded-lg tw-border tw-border-orange-500/30 tw-bg-black/50 tw-px-3 tw-py-1.5 tw-text-orange-50 focus:tw-border-orange-400 focus:tw-outline-none"
            />
          </label>

          <button
            onClick={openAdd}
            className="tw-rounded-lg tw-bg-gradient-to-b tw-from-orange-500 tw-to-red-600 tw-px-4 tw-py-2 tw-text-sm tw-font-bold tw-text-white tw-shadow-lg tw-shadow-orange-900/40 hover:tw-from-orange-400 hover:tw-to-red-500"
          >
            + Add contestant
          </button>

          {contestants.length > 0 && (
            <button
              onClick={resetAll}
              className="tw-rounded-lg tw-border tw-border-orange-500/30 tw-bg-black/40 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-orange-100 hover:tw-bg-black/60"
            >
              Reset all
            </button>
          )}

          <button
            onClick={restoreDefaults}
            className="tw-rounded-lg tw-border tw-border-orange-500/30 tw-bg-black/40 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-orange-100 hover:tw-bg-black/60"
          >
            Restore default players
          </button>

          {contestants.length > 0 && (
            <div className="tw-ml-auto tw-flex tw-gap-4 tw-text-sm">
              <span className="tw-text-orange-200/70">
                Spent{" "}
                <span className="tw-font-bold tw-text-orange-100">
                  {formatMoney(totals.spent)}
                </span>
              </span>
              <span className="tw-text-orange-200/70">
                Remaining{" "}
                <span className="tw-font-bold tw-text-green-300">
                  {formatMoney(totals.remaining)}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Grid */}
        {!hydrated ? null : contestants.length === 0 ? (
          <div className="tw-mx-auto tw-max-w-md tw-rounded-2xl tw-border tw-border-orange-500/20 tw-bg-black/40 tw-p-10 tw-text-center tw-backdrop-blur">
            <div className="tw-mb-3 tw-text-5xl">🏝️</div>
            <p className="tw-text-orange-100">
              No castaways yet. Hit{" "}
              <span className="tw-font-bold">+ Add contestant</span> to start the
              auction.
            </p>
          </div>
        ) : (
          <div className="tw-grid tw-grid-cols-1 tw-gap-5 sm:tw-grid-cols-2 lg:tw-grid-cols-3">
            <AnimatePresence>
              {contestants.map((c) => (
                <ContestantCard
                  key={c.id}
                  c={c}
                  onSpend={(amt) => updateBalance(c.id, -amt)}
                  onAdd={(amt) => updateBalance(c.id, amt)}
                  onSet={(v) => setBalance(c.id, v)}
                  onSetPot={(v) => setPot(c.id, v)}
                  onReset={() => resetToBudget(c.id)}
                  onEdit={() => openEdit(c)}
                  onRemove={() => removeContestant(c.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {draft.open && (
          <motion.div
            className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black/70 tw-p-4 tw-backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDraft(EMPTY_DRAFT)}
          >
            <motion.div
              className="tw-w-full tw-max-w-md tw-rounded-2xl tw-border tw-border-orange-500/40 tw-bg-[#140a04] tw-p-6 tw-shadow-2xl"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="fire-text tw-mb-4 tw-text-2xl tw-font-black tw-uppercase">
                {draft.editingId ? "Edit contestant" : "New contestant"}
              </h2>

              <div className="tw-space-y-4">
                <Field label="Player type">
                  <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                    {(["adult", "kid"] as ContestantType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            type: t,
                            // Snap budget to the type's default unless it was hand-edited.
                            startingBudget:
                              d.startingBudget === "" ||
                              d.startingBudget === String(budgetFor(d.type))
                                ? String(budgetFor(t))
                                : d.startingBudget,
                          }))
                        }
                        className={`tw-rounded-lg tw-border tw-px-3 tw-py-2 tw-text-sm tw-font-bold tw-capitalize tw-transition-colors ${
                          draft.type === t
                            ? "tw-border-orange-400 tw-bg-gradient-to-b tw-from-orange-500/40 tw-to-red-700/40 tw-text-orange-50"
                            : "tw-border-orange-500/30 tw-bg-black/40 tw-text-orange-200 hover:tw-bg-black/60"
                        }`}
                      >
                        {t === "kid" ? "🧒 Kid" : "🧑 Adult"}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Name">
                  <input
                    autoFocus
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && saveDraft()}
                    placeholder="Grandma Linda"
                    className="auction-input"
                  />
                </Field>

                <Field label="Photo path (optional)">
                  <input
                    value={draft.photo}
                    onChange={(e) => setDraft((d) => ({ ...d, photo: e.target.value }))}
                    placeholder="/auction/grandma.jpg"
                    className="auction-input"
                  />
                  <p className="tw-mt-1 tw-text-xs tw-text-orange-300/60">
                    Put image files in <code>public/auction/</code> and reference
                    them like <code>/auction/name.jpg</code>.
                  </p>
                </Field>

                <Field label="Starting budget">
                  <input
                    type="number"
                    min={0}
                    value={draft.startingBudget}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, startingBudget: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && saveDraft()}
                    className="auction-input"
                  />
                </Field>
              </div>

              <div className="tw-mt-6 tw-flex tw-gap-3">
                <button
                  onClick={() => setDraft(EMPTY_DRAFT)}
                  className="tw-flex-1 tw-rounded-lg tw-border tw-border-orange-500/30 tw-bg-black/40 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-orange-100 hover:tw-bg-black/60"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDraft}
                  disabled={!draft.name.trim()}
                  className="tw-flex-1 tw-rounded-lg tw-bg-gradient-to-b tw-from-orange-500 tw-to-red-600 tw-px-4 tw-py-2 tw-text-sm tw-font-bold tw-text-white hover:tw-from-orange-400 hover:tw-to-red-500 disabled:tw-opacity-40"
                >
                  {draft.editingId ? "Save" : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local input styling for the modal */}
      <style jsx global>{`
        .auction-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(249, 115, 22, 0.3);
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem 0.75rem;
          color: #fff7ed;
          outline: none;
        }
        .auction-input:focus {
          border-color: rgba(251, 146, 60, 0.9);
        }
        .auction-input::placeholder {
          color: rgba(255, 237, 213, 0.35);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="tw-block">
      <span className="tw-mb-1 tw-block tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wider tw-text-orange-300/80">
        {label}
      </span>
      {children}
    </label>
  );
}

function ContestantCard({
  c,
  onSpend,
  onAdd,
  onSet,
  onSetPot,
  onReset,
  onEdit,
  onRemove,
}: {
  c: Contestant;
  onSpend: (amt: number) => void;
  onAdd: (amt: number) => void;
  onSet: (v: number) => void;
  onSetPot: (v: number) => void;
  onReset: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const [custom, setCustom] = useState("");
  const [candIdx, setCandIdx] = useState(0);
  const [editingPot, setEditingPot] = useState(false);
  const [potDraft, setPotDraft] = useState("");
  const broke = c.balance <= 0;
  const isKid = c.type === "kid";
  const candidates = useMemo(() => photoCandidates(c.photo), [c.photo]);
  const currentSrc = candidates[candIdx];
  const showImage = !!currentSrc;

  // Restart the extension search if the photo path changes (e.g. after an edit).
  useEffect(() => setCandIdx(0), [c.photo]);

  function startEditPot() {
    setPotDraft(String(c.balance));
    setEditingPot(true);
  }

  function commitPot() {
    onSetPot(Math.max(0, Math.round(Number(potDraft) || 0)));
    setEditingPot(false);
  }

  function applyCustom(direction: 1 | -1) {
    const amt = Math.round(Number(custom) || 0);
    if (amt <= 0) return;
    if (direction === -1) onSpend(amt);
    else onAdd(amt);
    setCustom("");
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={`tw-relative tw-overflow-hidden tw-rounded-2xl tw-border tw-bg-black/50 tw-p-5 tw-backdrop-blur ${
        broke
          ? "tw-border-stone-600/40 tw-opacity-80 tw-grayscale"
          : "tw-border-orange-500/30"
      }`}
    >
      {/* glow */}
      {!broke && (
        <div className="tw-pointer-events-none tw-absolute tw-inset-x-0 tw-bottom-0 tw-h-24 tw-bg-[radial-gradient(80%_100%_at_50%_120%,rgba(255,110,0,0.35),transparent_70%)]" />
      )}

      <div className="tw-relative tw-flex tw-items-center tw-gap-4">
        {/* Avatar */}
        <div
          className={`tw-relative tw-h-16 tw-w-16 tw-shrink-0 tw-overflow-hidden tw-rounded-full tw-border-2 ${
            broke
              ? "tw-border-stone-500"
              : isKid
                ? "tw-border-cyan-400"
                : "tw-border-orange-400"
          } tw-bg-gradient-to-br tw-from-orange-700 tw-to-red-900`}
        >
          {showImage ? (
            <Image
              key={currentSrc}
              src={currentSrc}
              alt={c.name}
              fill
              sizes="64px"
              className="tw-object-cover"
              onError={() => setCandIdx((i) => i + 1)}
            />
          ) : (
            <div className="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center tw-text-lg tw-font-black tw-text-orange-100">
              {initials(c.name)}
            </div>
          )}
        </div>

        <div className="tw-min-w-0 tw-flex-1">
          <h3 className="tw-truncate tw-text-lg tw-font-bold tw-text-orange-50">
            {c.name}
          </h3>
          {editingPot ? (
            <input
              autoFocus
              type="number"
              min={0}
              value={potDraft}
              onChange={(e) => setPotDraft(e.target.value)}
              onBlur={commitPot}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitPot();
                if (e.key === "Escape") setEditingPot(false);
              }}
              className="auction-input tw-w-28 tw-text-2xl tw-font-black tw-tabular-nums"
            />
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.button
                key={c.balance}
                onClick={startEditPot}
                title="Click to set this player's money"
                initial={{ scale: 1.35, color: "#fde68a" }}
                animate={{ scale: 1, color: broke ? "#a8a29e" : "#86efac" }}
                transition={{ duration: 0.35 }}
                className="tw-block tw-text-2xl tw-font-black tw-tabular-nums hover:tw-opacity-80"
              >
                {formatMoney(c.balance)}
              </motion.button>
            </AnimatePresence>
          )}
          <p className="tw-text-xs tw-text-orange-300/50">
            of {formatMoney(c.startingBudget)}
            {broke && (
              <span className="tw-ml-2 tw-font-bold tw-text-stone-400">
                · TORCH SNUFFED
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Quick spends */}
      <div className="tw-relative tw-mt-4 tw-grid tw-grid-cols-4 tw-gap-2">
        {(isKid ? KID_QUICK_SPENDS : ADULT_QUICK_SPENDS).map((amt) => (
          <button
            key={amt}
            onClick={() => onSpend(amt)}
            className="tw-rounded-lg tw-border tw-border-orange-500/30 tw-bg-orange-950/40 tw-py-1.5 tw-text-sm tw-font-bold tw-text-orange-200 hover:tw-bg-orange-900/60"
          >
            -${amt}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="tw-relative tw-mt-2 tw-flex tw-gap-2">
        <input
          type="number"
          min={0}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyCustom(-1)}
          placeholder="Custom"
          className="auction-input tw-flex-1"
        />
        <button
          onClick={() => applyCustom(-1)}
          className="tw-rounded-lg tw-bg-gradient-to-b tw-from-red-500 tw-to-red-700 tw-px-3 tw-py-1.5 tw-text-sm tw-font-bold tw-text-white hover:tw-from-red-400"
          title="Spend (subtract)"
        >
          Spend
        </button>
        <button
          onClick={() => applyCustom(1)}
          className="tw-rounded-lg tw-bg-gradient-to-b tw-from-emerald-500 tw-to-emerald-700 tw-px-3 tw-py-1.5 tw-text-sm tw-font-bold tw-text-white hover:tw-from-emerald-400"
          title="Add money back"
        >
          Add
        </button>
      </div>

      {/* Footer actions */}
      <div className="tw-relative tw-mt-3 tw-flex tw-items-center tw-justify-between tw-text-xs">
        <button
          onClick={onReset}
          className="tw-text-orange-300/70 hover:tw-text-orange-200"
        >
          Reset to budget
        </button>
        <div className="tw-flex tw-gap-3">
          <button onClick={onEdit} className="tw-text-orange-300/70 hover:tw-text-orange-200">
            Edit
          </button>
          <button onClick={onRemove} className="tw-text-red-400/70 hover:tw-text-red-300">
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
