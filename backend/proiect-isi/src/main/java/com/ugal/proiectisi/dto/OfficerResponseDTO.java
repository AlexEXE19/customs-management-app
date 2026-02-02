package com.ugal.proiectisi.dto;

import com.ugal.proiectisi.model.Officer;

public class OfficerResponseDTO {

    private String id;
    private String firstName;
    private String lastName;
    private String role;

    public OfficerResponseDTO(Officer officer) {
        this.id = officer.getId();
        this.firstName = officer.getFirstName();
        this.lastName = officer.getLastName();
        this.role = officer.getRole().name(); // enum -> string
    }

    public OfficerResponseDTO(String s, String firstName, String lastName, String password, String name) {
    }

    // getters
    public String getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRole() { return role; }
}
