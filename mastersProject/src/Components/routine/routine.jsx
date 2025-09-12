import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// API helpers (prepend VITE_API_BASE_URL automatically)
import { get, post, del } from "@/lib/api";

const ROUTINE_PATH = "/routine";

// Small helper to title-case section names
const title = (s) => s[0].toUpperCase() + s.slice(1);

export default function Routine() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [activities, setActivities] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });

  // single inline add row instead of 3 different modals
  const [adding, setAdding] = useState(null); // 'morning' | 'afternoon' | 'evening' | null
  const [newName, setNewName] = useState("");

  // ------------------ Load ------------------
  useEffect(() => {
    const fetchRoutine = async () => {
      if (!currentUser?.uid) return;
      try {
        const data = await get(`${ROUTINE_PATH}/${currentUser.uid}`);
        setActivities({
          morning: data.morning || [],
          afternoon: data.afternoon || [],
          evening: data.evening || [],
        });
      } catch (err) {
        console.error("Fetch routine error:", err);
      }
    };
    fetchRoutine();
  }, [currentUser]);

  // ------------------ Persist ------------------
  const saveRoutine = async (updated) => {
    if (!currentUser?.uid) return;
    try {
      await post(`${ROUTINE_PATH}`, {
        userId: currentUser.uid,
        ...updated,
      });
    } catch (err) {
      console.error("Save routine error:", err);
    }
  };

  // ------------------ Actions ------------------
  const addActivity = (timeOfDay) => {
    const name = newName.trim();
    if (!name) return;

    setActivities((prev) => {
      const updated = {
        ...prev,
        [timeOfDay]: [...prev[timeOfDay], { name, completed: false }],
      };
      saveRoutine(updated);
      return updated;
    });

    setNewName("");
    setAdding(null);
  };

  const deleteTask = async (timeOfDay, index) => {
    if (!currentUser?.uid) return;

    setActivities((prev) => {
      const updatedList = prev[timeOfDay].filter((_, i) => i !== index);
      const updated = { ...prev, [timeOfDay]: updatedList };
      saveRoutine(updated);
      return updated;
    });

    try {
      await del(`${ROUTINE_PATH}/${currentUser.uid}/${timeOfDay}/${index}`);
    } catch (err) {
      console.error("Delete routine error:", err);
    }
  };

  const toggleActivityCompletion = (timeOfDay, index) => {
    setActivities((prev) => {
      const updatedList = prev[timeOfDay].map((act, i) =>
        i === index ? { ...act, completed: !act.completed } : act
      );
      const updated = { ...prev, [timeOfDay]: updatedList };
      saveRoutine(updated);
      return updated;
    });
  };

  const handleBack = () => navigate("/dashboard");

  // ------------------ UI ------------------
  const Section = ({ timeOfDay }) => {
    const list = activities[timeOfDay] || [];
    const isAdding = adding === timeOfDay;

    return (
      <Card className="flex-1 p-5 rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{title(timeOfDay)}</h2>
          {!isAdding ? (
            <Button size="sm" onClick={() => { setAdding(timeOfDay); setNewName(""); }}>
              <FontAwesomeIcon icon="fa-solid fa-plus" className="mr-2" />
              Add
            </Button>
          ) : (
            <div className="flex items-end gap-2">
              <div className="space-y-1">
                <Label htmlFor={`${timeOfDay}-new`}>New activity</Label>
                <Input
                  id={`${timeOfDay}-new`}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={`Add a ${timeOfDay} task…`}
                  className="w-56"
                />
              </div>
              <Button size="sm" onClick={() => addActivity(timeOfDay)}>Add</Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setAdding(null); setNewName(""); }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <ul className="space-y-2">
          {list.length > 0 ? (
            list.map((activity, idx) => (
              <li
                key={`${timeOfDay}-${idx}-${activity.name}`}
                className="flex items-center justify-between rounded-md border p-2 hover:bg-muted/50 transition"
              >
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!activity.completed}
                    onChange={() => toggleActivityCompletion(timeOfDay, idx)}
                    className="h-4 w-4 rounded border-muted-foreground/40"
                  />
                  <span className={activity.completed ? "line-through text-muted-foreground" : ""}>
                    {activity.name}
                  </span>
                </label>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteTask(timeOfDay, idx)}
                  title="Delete"
                >
                  <FontAwesomeIcon icon="trash" />
                </Button>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground italic">No activities yet.</li>
          )}
        </ul>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      {/* Back button */}
      <div className="mb-4">
       
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold leading-tight">Daily Routine</h1>
          <p className="text-sm text-muted-foreground">
            Build small habits for morning, afternoon, and evening.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Section timeOfDay="morning" />
          <Section timeOfDay="afternoon" />
          <Section timeOfDay="evening" />
        </div>
      </div>
    </div>
  );
}
