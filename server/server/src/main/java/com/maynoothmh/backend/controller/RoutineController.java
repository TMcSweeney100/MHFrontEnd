package com.maynoothmh.backend.controller;

import com.maynoothmh.backend.model.Routine;
import com.maynoothmh.backend.model.Task;
import com.maynoothmh.backend.repository.RoutineRepository;
import com.mongodb.client.model.ReturnDocument;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Collation.CaseFirst;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.CallSite;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/routine")

public class RoutineController {

	@Autowired
	private RoutineRepository routineRepo;

	// get gets the routine by {userId}
	@GetMapping("/{userId}")
	public ResponseEntity<Routine> getRoutine(@PathVariable String userId) {

		Optional<Routine> optionalRoutine = routineRepo.findByUserId(userId);

		Routine routine;

		if (optionalRoutine.isPresent()) {
			routine = optionalRoutine.get();
		} else {
			routine = new Routine(userId);
			routine.setMorning(new ArrayList<>());
			routine.setAfternoon(new ArrayList<>());
			routine.setEvening(new ArrayList<>());
		}

		return ResponseEntity.ok(routine);
	}

	// post /routine
	@PostMapping
	public ResponseEntity<Routine> saveOrUpdateRoutine(@RequestBody Routine routine) {
		Optional<Routine> existing = routineRepo.findByUserId(routine.getUserId());
		
		Routine toSave;
		
		if (existing.isPresent()) {
			Routine found = existing.get();
			found.setMorning(routine.getMorning());
			found.setAfternoon(routine.getAfternoon());
			found.setEvening(routine.getEvening());
			toSave = found;
		}else {
			toSave = routine;
		}
		
		Routine saved = routineRepo.save(toSave);
		return ResponseEntity.ok(saved);

	}


@DeleteMapping("/{userId}/{timeOfDay}/{index}")
public ResponseEntity<Void> deleteTask(@PathVariable String userId, 
		@PathVariable String timeOfDay,
		@PathVariable int index){
	
	Optional <Routine> optional = routineRepo.findByUserId(userId);
	
	if(optional.isEmpty()) {
		return ResponseEntity.notFound().build();
	}
	
	Routine routine = optional.get();
	List<Task> list;
	
	switch(timeOfDay.toLowerCase()) {
	
	case "morning":
		list = routine.getMorning();
		break;
		
	case "afternoon":
		list = routine.getAfternoon();
		break;
		
	case "evening":
		list = routine.getEvening();
		break;
	default:
		return ResponseEntity.badRequest().build();
		
	}
	
	if(list == null || index < 0 || index >= list.size()) {
		return ResponseEntity.badRequest().build();
	}
	
	list.remove(index);
	routineRepo.save(routine);
	return ResponseEntity.noContent().build();
	
}
}
	
	// post /routine


