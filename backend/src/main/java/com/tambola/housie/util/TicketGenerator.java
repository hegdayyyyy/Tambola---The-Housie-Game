package com.tambola.housie.util;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class TicketGenerator {

    static final int ROWS = 3;
    static final int COLS = 9;
    static final int NUMBERS_PER_ROW = 5;

    // Number range for each column
    static final int[] COLUMN_MIN = {1, 10, 20, 30, 40, 50, 60, 70, 80};
    static final int[] COLUMN_MAX = {9, 19, 29, 39, 49, 59, 69, 79, 90};

    // ========================================================
    // GENERATE TICKET
    // ========================================================
    public int[][] generateTicket() {
        // Step 1:
        // Decide how many numbers each column will contain
        int[] columnCount = generateColumnCounts();

        // Step 2:
        // Decide which rows will contain numbers
        boolean[][] pattern = new boolean[ROWS][COLS];
        int[] rowFill = new int[ROWS];
        generatePattern(0, columnCount, pattern, rowFill);

        // Step 3:
        // Fill actual numbers
        return fillNumbers(pattern, columnCount);
    }

    // ========================================================
    // GENERATE COLUMN COUNTS
    // ========================================================
    static int[] generateColumnCounts() {
        int[] count = new int[COLS];

        /**
         * Start with one number in every column.
         *
         * 1 1 1 1 1 1 1 1 1
         * Total = 9
         */
        Arrays.fill(count, 1);

        /**
         * We need 15 numbers.
         * 15 - 9 = 6 extra numbers.
         * Add one extra number to six random columns.
         * Therefore every column will have either:
         * 1 number
         * 2 numbers
         * or
         * 3 numbers
         */
        List<Integer> columns = new ArrayList<>();
        for (int i = 0; i < COLS; i++) {
            columns.add(i);
        }
        Collections.shuffle(columns, new Random());

        for (int i = 0; i < 6; i++) {
            count[columns.get(i)]++;
        }

        return count;
    }

    // ========================================================
    // BACKTRACKING
    // ========================================================
    static boolean generatePattern(int columnIndex,
                                    int[] columnCount,
                                    boolean[][] pattern,
                                    int[] rowFill) {
        /**
         * All 9 columns processed.
         * Check whether every row has exactly
         * 5 numbers.
         */
        if (columnIndex == COLS) {
            for (int row = 0; row < ROWS; row++) {
                if (rowFill[row] != NUMBERS_PER_ROW) {
                    return false;
                }
            }
            return true;
        }

        int numbersNeeded = columnCount[columnIndex];

        /**
         * Get possible row combinations.
         * If column needs:
         * 1 number → [0], [1], [2]
         * 2 numbers → [0,1], [0,2], [1,2]
         * 3 numbers → [0,1,2]
         */
        List<int[]> choices = getRowChoices(numbersNeeded);

        // Randomize pattern
        Collections.shuffle(choices, new Random());

        // Try every possibility
        for (int[] rows : choices) {
            if (!canPlace(rows, rowFill)) {
                continue;
            }

            // Place numbers
            for (int row : rows) {
                pattern[row][columnIndex] = true;
                rowFill[row]++;
            }

            /**
             * Move to next column.
             * If successful, we're done.
             */
            if (generatePattern(columnIndex + 1,
                    columnCount,
                    pattern,
                    rowFill)) {
                return true;
            }

            /**
             * Backtracking.
             * Remove the previous decision
             * and try another combination.
             */
            for (int row : rows) {
                pattern[row][columnIndex] = false;
                rowFill[row]--;
            }
        }

        return false;
    }

    // ========================================================
    // CHECK WHETHER ROWS CAN ACCEPT NUMBERS
    // ========================================================
    static boolean canPlace(int[] rows, int[] rowFill) {
        for (int row : rows) {
            if (rowFill[row] >= NUMBERS_PER_ROW) {
                return false;
            }
        }
        return true;
    }

    // ========================================================
    // ROW COMBINATIONS
    // ========================================================
    static List<int[]> getRowChoices(int numbersNeeded) {
        List<int[]> choices = new ArrayList<>();

        if (numbersNeeded == 1) {
            choices.add(new int[]{0});
            choices.add(new int[]{1});
            choices.add(new int[]{2});
        } else if (numbersNeeded == 2) {
            choices.add(new int[]{0, 1});
            choices.add(new int[]{0, 2});
            choices.add(new int[]{1, 2});
        } else if (numbersNeeded == 3) {
            choices.add(new int[]{0, 1, 2});
        }

        return choices;
    }

    // ========================================================
    // FILL NUMBERS
    // ========================================================
    static int[][] fillNumbers(boolean[][] pattern, int[] columnCount) {
        int[][] ticket = new int[ROWS][COLS];

        for (int column = 0; column < COLS; column++) {
            /**
             * Generate all numbers belonging
             * to this column.
             */
            List<Integer> numbers = new ArrayList<>();
            for (int number = COLUMN_MIN[column];
                 number <= COLUMN_MAX[column];
                 number++) {
                numbers.add(number);
            }

            /**
             * Randomize numbers.
             */
            Collections.shuffle(numbers, new Random());

            /**
             * Pick only the number of values
             * required by this column.
             */
            List<Integer> selected = new ArrayList<>(
                    numbers.subList(0, columnCount[column]));

            /**
             * Sort numbers vertically.
             */
            Collections.sort(selected);

            int index = 0;

            /**
             * Put numbers into the rows
             * according to the generated pattern.
             */
            for (int row = 0; row < ROWS; row++) {
                if (pattern[row][column]) {
                    ticket[row][column] = selected.get(index);
                    index++;
                }
            }
        }

        return ticket;
    }
}
