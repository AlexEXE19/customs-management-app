package com.ugal.proiectisi.repository;

import com.ugal.proiectisi.model.Officer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByLastNameAndPassword(String lastName, String password);

    Optional<Officer> findByLastName(String lastName);
}
