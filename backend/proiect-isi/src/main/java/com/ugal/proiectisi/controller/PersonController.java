package com.ugal.proiectisi.controller;

import com.ugal.proiectisi.model.Person;
import com.ugal.proiectisi.model.CheckedPerson;
import com.ugal.proiectisi.repository.CheckedPersonRepository;
import com.ugal.proiectisi.repository.PersonRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/persons")
public class PersonController {
    private final PersonRepository personRepository;
    private final CheckedPersonRepository checkedPersonRepository;

    public PersonController(PersonRepository personRepository, CheckedPersonRepository checkedPersonRepository) {
        this.personRepository = personRepository;
        this.checkedPersonRepository = checkedPersonRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getPerson(@PathVariable String id) {
        return personRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{checkedId}/risk")
    public ResponseEntity<Person> updateRiskLevel(
            @PathVariable String checkedId,
            @RequestParam int riskLevel) {

        return checkedPersonRepository.findById(checkedId)
                .map(checked -> {
                    return personRepository.findById(checked.getPersonId())
                            .map(person -> {
                                person.setRiskLevel(riskLevel);
                                Person updated = personRepository.save(person);
                                return ResponseEntity.ok(updated);
                            })
                            .orElse(ResponseEntity.notFound().build());
                })
                .orElse(ResponseEntity.notFound().build());
    }


}
