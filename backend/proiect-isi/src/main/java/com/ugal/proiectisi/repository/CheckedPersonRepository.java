package com.ugal.proiectisi.repository;

import com.ugal.proiectisi.model.CheckedPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CheckedPersonRepository extends JpaRepository<CheckedPerson, String> {

    // Find oldest N checked persons
    @Query("SELECT c FROM CheckedPerson c ORDER BY c.chekedDate ASC")
    List<CheckedPerson> findAllOrderedByDateAsc();

}
