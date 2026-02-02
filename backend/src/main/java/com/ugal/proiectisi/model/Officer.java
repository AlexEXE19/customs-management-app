package com.ugal.proiectisi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "officers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Officer {

    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public static enum Role {
        OFFICER,
        SUPERINTENDENT
    }
}
