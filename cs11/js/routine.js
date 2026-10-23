/**
 * Routine Module - Manages class routine schedule and transitions.
 */

export const routineData = [
  {
    id: 1,
    subject: "Web Technologies",
    venue: "Lab 3",
    duration: 15 // seconds
  },
  {
    id: 2,
    subject: "Database Systems",
    venue: "Room 204",
    duration: 20 // seconds
  },
  {
    id: 3,
    subject: "Computer Networks",
    venue: "Lab 1",
    duration: 25 // seconds
  }
];

let currentIndex = 0;

/**
 * Gets all routine entries.
 * @returns {Array} Array of class objects.
 */
export function getAllRoutine() {
  return [...routineData];
}

/**
 * Gets the current active class object.
 * @returns {Object} Current class routine item.
 */
export function getCurrentClass() {
  return routineData[currentIndex];
}

/**
 * Advances to the next class in the routine and returns it.
 * Cycles back to index 0 after reaching the end.
 * @returns {Object} The new active class item.
 */
export function advanceToNextClass() {
  currentIndex = (currentIndex + 1) % routineData.length;
  return routineData[currentIndex];
}

/**
 * Sets the active class by its ID.
 * @param {number} id Class ID.
 * @returns {Object|null} The selected class item or null.
 */
export function setClassById(id) {
  const index = routineData.findIndex(item => item.id === Number(id));
  if (index !== -1) {
    currentIndex = index;
    return routineData[currentIndex];
  }
  return null;
}

/**
 * Returns formatted upcoming class description, e.g. "Web Technologies (Lab 3)".
 * @param {Object} classItem 
 * @returns {string}
 */
export function formatClassTitle(classItem = getCurrentClass()) {
  return `${classItem.subject} (${classItem.venue})`;
}
