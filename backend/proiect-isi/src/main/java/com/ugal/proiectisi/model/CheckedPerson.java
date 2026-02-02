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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "person_id", nullable = false)
    private com.ugal.proiectisi.model.Person person;

    private String chekedDate;
    private boolean entryApproved;

    private String officerId;

    public void setRiskLevel(int riskLevel) {
    }

    public String getPersonId() {
        return person.getId();
    }
}
