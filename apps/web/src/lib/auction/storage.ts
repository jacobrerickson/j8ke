export interface Contestant {
  id: string;
  name: string;
  /** Path to a committed image in /public, e.g. "/auction/grandma.jpg". Empty = initials avatar. */
  photo: string;
  /** The amount this person started the auction with. */
  startingBudget: number;
  /** Current remaining money. */
  balance: number;
}

export interface AuctionSettings {
  /** Default starting budget applied to newly added contestants. */
  defaultBudget: number;
}

const DEFAULT_SETTINGS: AuctionSettings = { defaultBudget: 500 };

export class AuctionStorage {
  private static CONTESTANTS_KEY = "auction_contestants";
  private static SETTINGS_KEY = "auction_settings";

  static newId(): string {
    // Random + index-free; fine for a client-only roster.
    return "c_" + Math.random().toString(36).slice(2, 10);
  }

  static getContestants(): Contestant[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.CONTESTANTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Contestant[];
      return Array.isArray(parsed) ? parsed : [];
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
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AuctionSettings>) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static setSettings(settings: AuctionSettings) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}
