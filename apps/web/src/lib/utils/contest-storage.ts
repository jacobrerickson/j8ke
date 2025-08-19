export interface ContestEntry {
  deviceId: string;
  lastSubmissionDate: string;
  submissionCount: number;
  maxSubmissionsPerDay: number;
  entries: Array<{
    id: string;
    timestamp: string;
    selectionOption: string;
    status: "success" | "error" | "pending";
  }>;
}

export class ContestStorage {
  private static CONTEST_ENTRY_KEY = "contest_entry_data";
  private static DEVICE_ID_KEY = "contest_device_id";

  // Generate or retrieve a unique device ID
  static getDeviceId(): string {
    if (typeof window === "undefined") return "server-side";

    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);

    if (!deviceId) {
      // Generate a unique device ID using browser fingerprinting
      deviceId = this.generateDeviceId();
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  }

  // Generate a device ID based on browser characteristics
  private static generateDeviceId(): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx?.fillText("Device ID", 10, 10);

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency || "unknown",
    ].join("|");

    // Create a hash of the fingerprint
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return `device_${Math.abs(hash).toString(36)}`;
  }

  // Get contest entry data for current device
  static getContestEntry(): ContestEntry | null {
    if (typeof window === "undefined") return null;

    const deviceId = this.getDeviceId();
    const stored = localStorage.getItem(this.CONTEST_ENTRY_KEY);

    if (!stored) {
      // Initialize new entry
      const newEntry: ContestEntry = {
        deviceId,
        lastSubmissionDate: "",
        submissionCount: 0,
        maxSubmissionsPerDay: 7,
        entries: [],
      };
      this.setContestEntry(newEntry);
      return newEntry;
    }

    try {
      const entry = JSON.parse(stored) as ContestEntry;

      // If device ID changed, create new entry
      if (entry.deviceId !== deviceId) {
        const newEntry: ContestEntry = {
          deviceId,
          lastSubmissionDate: "",
          submissionCount: 0,
          maxSubmissionsPerDay: 7,
          entries: [],
        };
        this.setContestEntry(newEntry);
        return newEntry;
      }

      return entry;
    } catch (error) {
      console.error("Error parsing contest entry data:", error);
      return null;
    }
  }

  // Save contest entry data
  static setContestEntry(entry: ContestEntry): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.CONTEST_ENTRY_KEY, JSON.stringify(entry));
  }

  // Add a new submission entry
  static addSubmission(
    selectionOption: string,
    status: "success" | "error" | "pending" = "pending",
  ): void {
    const entry = this.getContestEntry();
    if (!entry) return;

    const today = new Date().toDateString();

    // Reset count if it's a new day
    if (entry.lastSubmissionDate !== today) {
      entry.submissionCount = 0;
      entry.entries = [];
    }

    // Add new entry
    entry.entries.push({
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      selectionOption,
      status,
    });

    entry.submissionCount++;
    entry.lastSubmissionDate = today;

    this.setContestEntry(entry);
  }

  // Check if device can submit today
  static canSubmitToday(): boolean {
    const entry = this.getContestEntry();
    if (!entry) return true;

    const today = new Date().toDateString();

    // Reset if it's a new day
    if (entry.lastSubmissionDate !== today) {
      return true;
    }

    return entry.submissionCount < entry.maxSubmissionsPerDay;
  }

  // Get remaining submissions for today
  static getRemainingSubmissions(): number {
    const entry = this.getContestEntry();
    if (!entry) return 7;

    const today = new Date().toDateString();

    if (entry.lastSubmissionDate !== today) {
      return entry.maxSubmissionsPerDay;
    }

    return Math.max(0, entry.maxSubmissionsPerDay - entry.submissionCount);
  }

  // Reset for new day
  static resetForNewDay(): void {
    const entry = this.getContestEntry();
    if (!entry) return;

    entry.submissionCount = 0;
    entry.entries = [];
    entry.lastSubmissionDate = "";

    this.setContestEntry(entry);
  }

  // Clear all contest data
  static clearContestData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.CONTEST_ENTRY_KEY);
    localStorage.removeItem(this.DEVICE_ID_KEY);
  }

  // Get submission history
  static getSubmissionHistory(): ContestEntry["entries"] {
    const entry = this.getContestEntry();
    return entry?.entries || [];
  }
}
