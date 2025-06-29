import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts"; // to get currentUser.uid
import { API_BASE_URL } from "../../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../ui/button";


const Routine = () =>{

const navigate = useNavigate();

const handleNavigation = () => {

navigate("/dashboard");
}

const { currentUser} = useAuth();



// using this to store activites
const [activities,setActivities] = useState({
morning:[],
afternoon:[],
evening:[]
});



// state to control the add activity and its form
const [showAddActivityMorn, setShowAddActivityMorn] = useState(false);
const [showAddActivityEve, setShowAddActivityEve] = useState(false);
const [showAddActivityAfter, setShowAddActivityAfter] = useState(false);

const [newActivity, setNewActivity] = useState({
name: "",
timeOfDay: "morning"
});


// 3. Fetch existing routine from backend on mount (and whenever user changes)
useEffect(() => {
if (!currentUser) return;
fetch(`${API_BASE_URL}/${currentUser.uid}`)
.then(res => res.json())
.then(data => {
setActivities({
morning: data.morning || [],
afternoon: data.afternoon || [],
evening: data.evening || []
});
})
.catch(err => console.error("Fetch routine error:", err));
}, [currentUser]);



const saveRoutine = (updatedActivites) => {
if(!currentUser) return;

fetch(API_BASE_URL, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
userId: currentUser.uid,
...updatedActivites
})
}).catch(err => console.error("Save routine error",err));
};

const handleAddActivity = () => {
if (newActivity.name.trim() === "") return;

setActivities(prev => {
const updated = {
...prev,
[newActivity.timeOfDay]: [
...prev[newActivity.timeOfDay],
{ name: newActivity.name, completed: false }
]
};
saveRoutine(updated);
return updated;
})

setNewActivity({ name: "", timeOfDay: "morning" });
// setShowAddActivity(false);
};

const deleteTask = (timeOfDay, index) => {
if(!currentUser) return;

setActivities( prev => {
  const updatedList = prev[timeOfDay].filter((_,i) => i !== index);
  const updated = {...prev,[timeOfDay]:updatedList}
  saveRoutine(updated);
  return updated;

})

fetch(
  `${API_BASE_URL}/$currentUser.uid/${timeOfDay}/${index}`,
  {method:"DELETE"}
)

.then(res =>{

        if (!res.ok){
          throw new Error(`Delete Failed: ${res.status}`);
        } 
}
)
.catch(err => {
    console.error("Delete rotuine error:" , err);

})
}




const toggleActivityCompletion = (timeOfDay, index) => {
setActivities(prev => {
const updatedList = prev[timeOfDay].map((act, i) =>
i === index ? { ...act, completed: !act.completed } : act
);
const updated = { ...prev, [timeOfDay]: updatedList };
saveRoutine(updated); 
return updated;
});
};



return (
<div className=" relative max-w-5xl mx-auto p-6">
{/* Page title */}
<h1 className="text-4xl font-extrabold text-center mb-8">
Daily Routine
</h1>

{/* Three columns: Morning / Afternoon / Evening */}
<div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
{["morning", "afternoon", "evening"].map((timeOfDay) => (
<div
key={timeOfDay}
className="flex-1 bg-white shadow rounded-lg p-4 flex flex-col"
>
{/* Heading */}
<h2 className="text-2xl font-semibold capitalize mb-4">
{timeOfDay}
</h2>

{/* Task list */}
<ul className="flex-1 space-y-2 overflow-y-auto">
{(activities[timeOfDay].length || []) > 0 ? (
activities[timeOfDay].map((activity, idx) => (
<li
  key={idx}
  className="group flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-200 rounded transition"
  onClick={() => toggleActivityCompletion(timeOfDay,idx)}
>
  {/* Make the label take up all available space */}
  <label className="flex-1 flex items-center space-x-2">
   
    <span className={`${activity.completed ? "line-through text-gray-400" : ""}`}>
      {activity.name}
    </span>
  </label>

  {/* Trash icon now a direct child of the li, so justify-between pushes it to the right edge */}
  <FontAwesomeIcon
    icon="trash"
    className="text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition"
    onClick={(e) => {
      e.stopPropagation();
      deleteTask(timeOfDay,idx);

    }}
  />
</li>
))
) : (
<li className="text-gray-500 italic">
No activities yet.
</li>
)}
</ul>

{/* Add‐task button for this column */}
<button
onClick={() => {
setNewActivity({ name: "", timeOfDay });
if(timeOfDay === "evening"){
setShowAddActivityEve(true);
}else if (timeOfDay=== "morning") {
setShowAddActivityMorn(true);
} else {
setShowAddActivityAfter(true);
}{

}
// setShowAddActivity(true);
}}
className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
>
<FontAwesomeIcon icon="fa-solid fa-plus" beatFade />
</button>
</div>
))}
</div>

{/* Add Activity modal (unchanged) */}
{ showAddActivityMorn && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
<h3 className="text-xl font-bold">Add New Activity</h3>
<input
type="text"
placeholder="Activity Name"
value={newActivity.name}
onChange={(e) =>
setNewActivity({ ...newActivity, name: e.target.value,timeOfDay: "morning" })
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

{ showAddActivityAfter && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
<h3 className="text-xl font-bold">Add New Activity</h3>
<input
type="text"
placeholder="Activity Name"
value={newActivity.name}
onChange={(e) =>{
setNewActivity({ ...newActivity, name: e.target.value,timeOfDay: "afternoon" });
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

{/* Add Evening Activity modal */}

{ showAddActivityEve && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
<h3 className="text-xl font-bold">Add New Evening Activity</h3>
<input
type="text"
placeholder="Activity Name"
value={newActivity.name}
onChange={(e) =>
setNewActivity({ ...newActivity, name: e.target.value,timeOfDay: "evening" })
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
<div className=" absolute top-5 left-6 mt-2 mb-2 ">
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
