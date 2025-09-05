import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";

// If you don't have the @ alias, use: import { get, post, del } from "../../lib/api";
import { get, post, del } from "@/lib/api";

const ROUTINE_PATH = "/routine";

const Routine = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNavigation = () => navigate("/dashboard");

  const [activities, setActivities] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });

  const [showAddActivityMorn, setShowAddActivityMorn] = useState(false);
  const [showAddActivityEve, setShowAddActivityEve] = useState(false);
  const [showAddActivityAfter, setShowAddActivityAfter] = useState(false);

  const [newActivity, setNewActivity] = useState({
    name: "",
    timeOfDay: "morning",
  });

  // fetch existing routine
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

  const saveRoutine = async (updatedActivities) => {
    if (!currentUser?.uid) return;
    try {
      await post(ROUTINE_PATH, {
        userId: currentUser.uid,
        ...updatedActivities,
      });
    } catch (err) {
      console.error("Save routine error", err);
    }
  };

  const handleAddActivity = () => {
    if (newActivity.name.trim() === "") return;

    setActivities((prev) => {
      const updated = {
        ...prev,
        [newActivity.timeOfDay]: [
          ...prev[newActivity.timeOfDay],
          { name: newActivity.name, completed: false },
        ],
      };
      saveRoutine(updated);
      return updated;
    });

    setNewActivity({ name: "", timeOfDay: "morning" });
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

  return (
    <div className=" ">
      <h1 className="text-4xl font-extrabold text-center mb-8">Daily Routine</h1>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        {["morning", "afternoon", "evening"].map((timeOfDay) => (
          <div key={timeOfDay} className="flex-1 bg-white shadow rounded-lg p-4 flex flex-col">
            <h2 className="text-2xl font-semibold capitalize mb-4">{timeOfDay}</h2>

            <ul className="flex-1 space-y-2 overflow-y-auto">
              {(activities[timeOfDay].length || []) > 0 ? (
                activities[timeOfDay].map((activity, idx) => (
                  <li
                    key={idx}
                    className="group flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-200 rounded transition"
                    onClick={() => toggleActivityCompletion(timeOfDay, idx)}
                  >
                    <label className="flex-1 flex items-center space-x-2">
                      <span className={activity.completed ? "line-through text-gray-400" : ""}>
                        {activity.name}
                      </span>
                    </label>
                    <FontAwesomeIcon
                      icon="trash"
                      className="text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(timeOfDay, idx);
                      }}
                    />
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No activities yet.</li>
              )}
            </ul>

            <button
              onClick={() => {
                setNewActivity({ name: "", timeOfDay });
                if (timeOfDay === "evening") setShowAddActivityEve(true);
                else if (timeOfDay === "morning") setShowAddActivityMorn(true);
                else setShowAddActivityAfter(true);
              }}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" beatFade />
            </button>
          </div>
        ))}
      </div>

      {/* Morning modal */}
      {showAddActivityMorn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold">Add New Activity</h3>
            <input
              type="text"
              placeholder="Activity Name"
              value={newActivity.name}
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value, timeOfDay: "morning" })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  handleAddActivity();
                  setShowAddActivityMorn(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddActivityMorn(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Afternoon modal */}
      {showAddActivityAfter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold">Add New Activity</h3>
            <input
              type="text"
              placeholder="Activity Name"
              value={newActivity.name}
              onChange={(e) => {
                setNewActivity({ ...newActivity, name: e.target.value, timeOfDay: "afternoon" });
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  handleAddActivity();
                  setShowAddActivityAfter(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddActivityAfter(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evening modal */}
      {showAddActivityEve && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold">Add New Evening Activity</h3>
            <input
              type="text"
              placeholder="Activity Name"
              value={newActivity.name}
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value, timeOfDay: "evening" })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  handleAddActivity();
                  setShowAddActivityEve(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddActivityEve(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard navigation */}
      <div className="absolute top-5 left-6 mt-2 mb-2 ">
        <button
          onClick={handleNavigation}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-900 transition"
        >
          <FontAwesomeIcon icon="fa-solid fa-left-long" />
        </button>
      </div>

      <div>
        <Button variant="outline">Click Me</Button>
      </div>
    </div>
  );
};

export default Routine;
