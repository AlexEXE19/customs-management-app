package com.ugal.proiectisi.controller;


import com.ugal.proiectisi.dto.LoginRequest;
import com.ugal.proiectisi.dto.RegisterRequest;
import com.ugal.proiectisi.model.Officer;
import com.ugal.proiectisi.repository.OfficerRepository;
import com.ugal.proiectisi.dto.OfficerResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class OfficerController {

    private final OfficerRepository officerRepository;

    public OfficerController(OfficerRepository officerRepository) {
        this.officerRepository = officerRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<OfficerResponseDTO> login(@RequestBody LoginRequest request) {

        Optional<Officer> officerOpt = officerRepository
                .findByLastNameAndPassword(request.getLastName(), request.getPassword());

        if (officerOpt.isPresent()) {
            Officer officer = officerOpt.get();
            OfficerResponseDTO response = new OfficerResponseDTO(officer);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // or 404
        }
    }



    @PostMapping("/register")
    public ResponseEntity<OfficerResponseDTO> register(@RequestBody RegisterRequest request) {

        if (officerRepository.findByLastName(request.getLastName()).isPresent()) {
            return ResponseEntity.status(409).build();
        }

        Officer newOfficer = new Officer();
        newOfficer.setId(java.util.UUID.randomUUID().toString());
        newOfficer.setFirstName(request.getFirstName());
        newOfficer.setLastName(request.getLastName());
        newOfficer.setPassword(request.getPassword());
        newOfficer.setRole(Officer.Role.valueOf(request.getRole()));

        Officer savedOfficer = officerRepository.save(newOfficer);

        OfficerResponseDTO response = new OfficerResponseDTO(savedOfficer);

        return ResponseEntity.ok(response);
    }


}
