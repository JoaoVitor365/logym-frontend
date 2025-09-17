package com.logym.service;

import com.logym.model.Academy;
import com.logym.repository.AcademyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AcademyService {
    @Autowired
    private AcademyRepository academyRepository;

    public List<Academy> findAll() {
        return academyRepository.findAll();
    }

    public Optional<Academy> findById(Long id) {
        return academyRepository.findById(id);
    }

    public Academy save(Academy academy) {
        return academyRepository.save(academy);
    }
}