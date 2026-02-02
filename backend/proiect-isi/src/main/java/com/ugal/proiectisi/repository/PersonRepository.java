package com.ugal.proiectisi.repository;

import com.ugal.proiectisi.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, String> {
}
