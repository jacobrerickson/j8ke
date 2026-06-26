export type ContestantType = "adult" | "kid";

export interface Contestant {
  id: string;
  name: string;
  /** "adult" or "kid" — drives default budget and a badge on the card. */
  type: ContestantType;
  /** Path to a committed image in /public, e.g. "/auction/jake.jpg". Empty = initials avatar. */
  photo: string;
  /** The amount this person started the auction with. */
  startingBudget: number;
  /** Current remaining money. */
  balance: number;
}

export interface AuctionSettings {
  /** Default starting budget for new adult contestants. */
  adultBudget: number;
  /** Default starting budget for new kid contestants. */
  kidBudget: number;
}

const DEFAULT_SETTINGS: AuctionSettings = { adultBudget: 500, kidBudget: 250 };

/** Default players. Photos resolve to /auction/<slug>.jpg (initials fallback if missing). */
const DEFAULT_PEOPLE: { name: string; type: ContestantType }[] = [
  { name: "Mom", type: "adult" },
  { name: "Dad", type: "adult" },
  { name: "Jeff", type: "adult" },
  { name: "Shaylee", type: "adult" },
  { name: "Reese", type: "kid" },
  { name: "Shane", type: "kid" },
  { name: "Kelton", type: "adult" },
  { name: "Harper", type: "kid" },
  { name: "Miles", type: "kid" },
  { name: "Marissa", type: "adult" },
  { name: "Deion", type: "adult" },
  { name: "Hailey", type: "kid" },
  { name: "Josh", type: "adult" },
  { name: "Heather", type: "adult" },
  { name: "Ryan", type: "adult" },
  { name: "Lena", type: "kid" },
  { name: "Malina", type: "adult" },
  { name: "Jake", type: "adult" },
];

export function nameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildDefaultRoster(settings: AuctionSettings): Contestant[] {
  return DEFAULT_PEOPLE.map((p, i) => {
    const budget = p.type === "kid" ? settings.kidBudget : settings.adultBudget;
    return {
      id: "seed_" + nameToSlug(p.name) + "_" + i,
      name: p.name,
      type: p.type,
      photo: `/auction/${nameToSlug(p.name)}.jpg`,
      startingBudget: budget,
      balance: budget,
    };
  });
}

export class AuctionStorage {
  private static CONTESTANTS_KEY = "auction_contestants";
  private static SETTINGS_KEY = "auction_settings";
  private static SEEDED_KEY = "auction_seeded";

  static newId(): string {
    // Random + index-free; fine for a client-only roster.
    return "c_" + Math.random().toString(36).slice(2, 10);
  }

  static getDefaultRoster(): Contestant[] {
    return buildDefaultRoster(this.getSettings());
  }

  static getContestants(): Contestant[] {
    if (typeof window === "undefined") return [];

    // Seed the default players the first time the page is ever opened.
    // A flag (not "is the list empty?") so deletions stick across refreshes.
    if (!localStorage.getItem(this.SEEDED_KEY)) {
      const seeded = buildDefaultRoster(this.getSettings());
      this.setContestants(seeded);
      localStorage.setItem(this.SEEDED_KEY, "1");
      return seeded;
    }

    try {
      const raw = localStorage.getItem(this.CONTESTANTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Partial<Contestant>[];
      if (!Array.isArray(parsed)) return [];
      // Backfill type for any older records.
      return parsed.map((c) => ({
        type: "adult",
        photo: "",
        startingBudget: 0,
        balance: 0,
        ...c,
      })) as Contestant[];
    } catch {
      return [];
    }
  }

  static setContestants(contestants: Contestant[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.CONTESTANTS_KEY, JSON.stringify(contestants));
  }

  static getSettings(): AuctionSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(this.SETTINGS_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<AuctionSettings> & {
        defaultBudget?: number;
      };
      return {
        adultBudget: parsed.adultBudget ?? parsed.defaultBudget ?? DEFAULT_SETTINGS.adultBudget,
        kidBudget: parsed.kidBudget ?? DEFAULT_SETTINGS.kidBudget,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static setSettings(settings: AuctionSettings) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}
