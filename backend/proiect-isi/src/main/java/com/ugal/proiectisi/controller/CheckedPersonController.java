package com.ugal.proiectisi.controller;

import com.ugal.proiectisi.dto.CheckedPersonResponseDTO;
import com.ugal.proiectisi.model.CheckedPerson;
import com.ugal.proiectisi.model.Person;
import com.ugal.proiectisi.repository.CheckedPersonRepository;
import com.ugal.proiectisi.repository.PersonRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/checked-persons")
public class CheckedPersonController {

    private final CheckedPersonRepository checkedPersonRepository;
    private final PersonRepository personRepository;

    public CheckedPersonController(CheckedPersonRepository checkedPersonRepository,
                                   PersonRepository personRepository) {
        this.checkedPersonRepository = checkedPersonRepository;
        this.personRepository = personRepository;
    }

    @GetMapping("/all")
    public List<CheckedPersonResponseDTO> getAllCheckedPersons() {
        return checkedPersonRepository.findAll()
                .stream()
                .map(CheckedPersonResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/add")
    public ResponseEntity<CheckedPersonResponseDTO> addCheckedPerson(
            @RequestParam String personId,
            @RequestParam boolean approved,
            @RequestParam String officerId) {

        return personRepository.findById(personId)
                .map(person -> {
                    CheckedPerson checked = new CheckedPerson();

                    checked.setId(UUID.randomUUID().toString());

                    checked.setPerson(person);

                    checked.setEntryApproved(approved);
                    checked.setOfficerId(officerId);

                    DateTimeFormatter DateTimeFormatter = null;
                    checked.setChekedDate(
                            LocalDateTime.now()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                    );

                    CheckedPerson saved = checkedPersonRepository.save(checked);
                    return ResponseEntity.ok(new CheckedPersonResponseDTO(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/oldest")
    @Transactional
    public ResponseEntity<Void> deleteLastThreeOldest() {
        List<CheckedPerson> oldestThree = checkedPersonRepository.findAllOrderedByDateAsc()
                .stream()
                .limit(3)
                .collect(Collectors.toList());

        if (oldestThree.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        checkedPersonRepository.deleteAll(oldestThree);
        return ResponseEntity.ok().build();
    }
}
