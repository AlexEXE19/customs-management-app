package com.ugal.proiectisi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "persons_checked")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckedPerson {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER) // Fetch person data with checked record
    @JoinColumn(name = "person_id", nullable = false)
    private com.ugal.proiectisi.model.Person person; // Foreign key to Person

    private String chekedDate;
    private boolean entryApproved;

    private String officerId; // Foreign key to Officer if you add that entity later

    public void setRiskLevel(int riskLevel) {
    }

    public String getPersonId() {
        return person.getId();
    }
}
