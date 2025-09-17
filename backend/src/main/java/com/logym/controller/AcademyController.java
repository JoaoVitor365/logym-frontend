package com.logym.controller;

import com.logym.model.Academy;
import com.logym.service.AcademyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academies")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademyController {
    @Autowired
    private AcademyService academyService;

    @GetMapping
    public List<Academy> getAllAcademies() {
        return academyService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Academy> getAcademyById(@PathVariable Long id) {
        return academyService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Academy createAcademy(@RequestBody Academy academy) {
        return academyService.save(academy);
    }
}