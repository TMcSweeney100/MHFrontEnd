package com.maynoothmh.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "routines")
public class Routine {

    @Id
    private String id;

    private String userId;
    private List<Task> morning;
    private List<Task> afternoon;
    private List<Task> evening;

    public Routine() {
    }

    public Routine(String userId) {
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<Task> getMorning() {
        return morning;
    }

    public void setMorning(List<Task> morning) {
        this.morning = morning;
    }

    public List<Task> getAfternoon() {
        return afternoon;
    }

    public void setAfternoon(List<Task> afternoon) {
        this.afternoon = afternoon;
    }

    public List<Task> getEvening() {
        return evening;
    }

    public void setEvening(List<Task> evening) {
        this.evening = evening;
    }
}
