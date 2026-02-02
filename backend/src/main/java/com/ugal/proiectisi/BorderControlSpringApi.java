package com.ugal.proiectisi;

import com.ugal.proiectisi.model.Officer;
import com.ugal.proiectisi.repository.OfficerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class BorderControlSpringApi {

    public static void main(String[] args) {
        SpringApplication.run(BorderControlSpringApi.class, args);
    }

    @Bean
    CommandLineRunner seedSuperintendent(OfficerRepository officerRepository) {
        return args -> {
            String defaultLastName = "superintendent";
            String defaultPassword = "supersecret";

            officerRepository.findByLastName(defaultLastName).ifPresentOrElse(
                    existing -> {},
                    () -> {
                        Officer o = new Officer();
                        o.setId(UUID.randomUUID().toString());
                        o.setFirstName("Default");
                        o.setLastName(defaultLastName);
                        o.setPassword(defaultPassword);
                        o.setRole(Officer.Role.SUPERINTENDENT);
                        officerRepository.save(o);
                    }
            );
        };
    }
}
