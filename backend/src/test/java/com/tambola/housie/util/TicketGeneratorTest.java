package com.tambola.housie.util;

import org.junit.jupiter.api.Test;

import java.util.Arrays;

class TicketGeneratorTest {

    @Test
    void testGenerateMultipleTickets() {
        TicketGenerator generator = new TicketGenerator();
        
        System.out.println("=".repeat(50));
        System.out.println("TESTING TICKET GENERATOR");
        System.out.println("=".repeat(50));

        // Generate 5 tickets
        for (int i = 1; i <= 5; i++) {
            int[][] ticket = generator.generateTicket();
            
            System.out.println("\nTicket #" + i + ":");
            System.out.println("-".repeat(50));
            printTicket(ticket);
            
            // Verify structure
            verifyTicketStructure(ticket);
        }
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("ALL TICKETS GENERATED SUCCESSFULLY");
        System.out.println("=".repeat(50));
    }

    private void printTicket(int[][] ticket) {
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                if (ticket[row][col] == 0) {
                    System.out.print("   ");
                } else {
                    System.out.printf("%2d ", ticket[row][col]);
                }
            }
            System.out.println();
        }
        
        System.out.println("\nRaw array: " + Arrays.deepToString(ticket));
    }

    private void verifyTicketStructure(int[][] ticket) {
        // Verify dimensions
        assert ticket.length == 3 : "Ticket should have 3 rows";
        assert ticket[0].length == 9 : "Ticket should have 9 columns";
        
        // Count numbers per row
        for (int row = 0; row < 3; row++) {
            int count = 0;
            for (int col = 0; col < 9; col++) {
                if (ticket[row][col] != 0) {
                    count++;
                }
            }
            assert count == 5 : "Row " + row + " should have exactly 5 numbers, but has " + count;
        }
        
        // Count total numbers
        int totalNumbers = 0;
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                if (ticket[row][col] != 0) {
                    totalNumbers++;
                }
            }
        }
        assert totalNumbers == 15 : "Ticket should have exactly 15 numbers, but has " + totalNumbers;
        
        System.out.println("✓ Ticket structure verified: 3 rows, 5 numbers per row, 15 total");
    }
}
