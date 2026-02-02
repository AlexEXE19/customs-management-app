package com.ugal.proiectisi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "persons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    @Id
    private String id;

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private EntryPurpose entryPurpose;

    private String nationality;
    private String homeCity;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    private int riskLevel;
    private String issueDate;

    public enum DocumentType {
        Passport, National_ID, Driving_License
    }

    public enum EntryPurpose {
        Tourism, Business, Work, Transit, Studies
    }
}
