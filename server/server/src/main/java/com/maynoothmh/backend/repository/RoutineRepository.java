package com.maynoothmh.backend.repository;

import com.maynoothmh.backend.model.Routine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoutineRepository extends MongoRepository<Routine, String> {
    Optional<Routine> findByUserId(String userId);
}