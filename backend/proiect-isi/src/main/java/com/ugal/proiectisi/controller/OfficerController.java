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

        // Step 1: Check if lastName already exists
        if (officerRepository.findByLastName(request.getLastName()).isPresent()) {
            return ResponseEntity.status(409).build(); // Conflict: user exists
        }

        // Step 2: Create new Officer
        Officer newOfficer = new Officer();
        newOfficer.setId(java.util.UUID.randomUUID().toString()); // unique string ID
        newOfficer.setFirstName(request.getFirstName());
        newOfficer.setLastName(request.getLastName());
        newOfficer.setPassword(request.getPassword()); // store plaintext for now
        newOfficer.setRole(Officer.Role.valueOf(request.getRole())); // enum

        // Step 3: Save to database
        Officer savedOfficer = officerRepository.save(newOfficer);

        // Step 4: Map to Response DTO
        OfficerResponseDTO response = new OfficerResponseDTO(savedOfficer);

        // Step 5: Return response
        return ResponseEntity.ok(response); // 200 OK
    }


}
