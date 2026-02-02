package com.ugal.proiectisi.utils;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FileLogger {

    // Absolute path to Desktop
    private static final String LOG_FILE = "C:/Users/PC_NEWUSER/Desktop/audit.log";
    private static final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static synchronized void log(String officerName, String endpoint, String action, String sqlQuery) {
        String timestamp = LocalDateTime.now().format(dtf);
        String logEntry = String.format("[%s] Officer: %s | Endpoint: %s | Action: %s | SQL: %s%n",
                timestamp,
                officerName != null ? officerName : "UNKNOWN",
                endpoint != null ? endpoint : "N/A",
                action != null ? action : "N/A",
                sqlQuery != null ? sqlQuery : "N/A"
        );

        try (FileWriter fw = new FileWriter(LOG_FILE, true)) { // append mode
            fw.write(logEntry);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
