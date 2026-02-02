package com.ugal.proiectisi.dto;

import com.ugal.proiectisi.model.CheckedPerson;

public class CheckedPersonResponseDTO {

    private String id;
    private String personId;
    private String firstName;
    private String lastName;
    private String entryPurpose;
    private String nationality;
    private String homeCity;
    private String documentType;
    private int riskLevel;
    private String issueDate;
    private String chekedDate;
    private boolean entryApproved;
    private String officerId;

    public CheckedPersonResponseDTO(CheckedPerson c) {
        this.id = c.getId();
        this.personId = c.getPerson().getId();
        this.firstName = c.getPerson().getFirstName();
        this.lastName = c.getPerson().getLastName();
        this.entryPurpose = c.getPerson().getEntryPurpose().name();
        this.nationality = c.getPerson().getNationality();
        this.homeCity = c.getPerson().getHomeCity();
        this.documentType = c.getPerson().getDocumentType().name();
        this.riskLevel = c.getPerson().getRiskLevel();
        this.issueDate = c.getPerson().getIssueDate();
        this.chekedDate = c.getChekedDate();
        this.entryApproved = c.isEntryApproved();
        this.officerId = c.getOfficerId();
    }

    // getters
    public String getId() { return id; }
    public String getPersonId() { return personId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEntryPurpose() { return entryPurpose; }
    public String getNationality() { return nationality; }
    public String getHomeCity() { return homeCity; }
    public String getDocumentType() { return documentType; }
    public int getRiskLevel() { return riskLevel; }
    public String getIssueDate() { return issueDate; }
    public String getChekedDate() { return chekedDate; }
    public boolean isEntryApproved() { return entryApproved; }
    public String getOfficerId() { return officerId; }
}
