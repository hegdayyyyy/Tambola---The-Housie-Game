export type TicketGrid = number[][]; // 3 x 9, 0 = empty

export type WinningMethod =
  "Early Five" | "Top Line" | "Middle Line" | "Bottom Line" | "Full House";

export const WINNING_METHODS: { id: WinningMethod; description: string }[] = [
  { id: "Early Five", description: "First to mark any five numbers." },
  { id: "Top Line", description: "Complete the first row of your ticket." },
  { id: "Middle Line", description: "Complete the second row of your ticket." },
  { id: "Bottom Line", description: "Complete the third row of your ticket." },
  { id: "Full House", description: "Mark every number on your ticket." },
];

export const VALID_ROOM_CODES = ["ABC123", "TAMB01", "GAME77"];

/** Deterministic sample ticket sets — rotated by "Get New Tickets". */
export const TICKET_SETS: TicketGrid[][] = [
  [
    [
      [5, 0, 23, 0, 47, 0, 62, 73, 0],
      [0, 14, 0, 35, 0, 55, 0, 79, 81],
      [8, 0, 29, 0, 52, 0, 68, 0, 90],
    ],
    [
      [0, 11, 21, 0, 44, 0, 0, 71, 85],
      [3, 0, 0, 38, 0, 57, 63, 0, 88],
      [9, 17, 0, 0, 49, 0, 66, 76, 0],
    ],
    [
      [7, 0, 0, 31, 41, 0, 61, 0, 82],
      [0, 19, 26, 0, 0, 54, 0, 74, 0],
      [0, 0, 28, 39, 46, 58, 0, 77, 89],
    ],
  ],
  [
    [
      [2, 0, 22, 34, 0, 0, 64, 0, 83],
      [0, 16, 0, 0, 45, 51, 0, 72, 0],
      [6, 0, 27, 36, 0, 59, 69, 0, 86],
    ],
    [
      [0, 13, 24, 0, 42, 0, 0, 70, 84],
      [1, 0, 0, 33, 0, 53, 65, 78, 0],
      [4, 18, 0, 37, 48, 0, 0, 0, 87],
    ],
    [
      [0, 10, 0, 30, 43, 0, 60, 75, 0],
      [5, 0, 25, 0, 0, 50, 67, 0, 80],
      [9, 15, 0, 32, 0, 56, 0, 0, 90],
    ],
  ],
  [
    [
      [3, 12, 0, 0, 40, 0, 63, 0, 81],
      [0, 0, 20, 35, 0, 52, 0, 73, 85],
      [8, 19, 0, 0, 49, 57, 66, 0, 0],
    ],
    [
      [0, 14, 21, 31, 0, 0, 0, 71, 88],
      [6, 0, 0, 0, 44, 55, 62, 79, 0],
      [7, 17, 29, 0, 0, 0, 68, 0, 82],
    ],
    [
      [1, 0, 23, 0, 41, 51, 0, 0, 80],
      [0, 11, 0, 38, 0, 0, 61, 74, 89],
      [4, 0, 26, 39, 47, 0, 0, 76, 0],
    ],
  ],
];

export const BOT_NAMES = ["Priya", "Rahul", "Ananya", "Vikram"];

/** Deterministic call order. */
export const CALL_SEQUENCE: number[] = (() => {
  const nums = Array.from({ length: 90 }, (_, i) => i + 1);
  // Fixed shuffle using a simple LCG with a constant seed.
  let seed = 20260821;
  for (let i = nums.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [nums[i], nums[j]] = [nums[j]!, nums[i]!];
  }
  return nums;
})();

export function ticketNumbers(t: TicketGrid): number[] {
  return t.flat().filter((n) => n > 0);
}
