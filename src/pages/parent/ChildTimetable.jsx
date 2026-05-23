import { useNavigate } from "react-router-dom";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const periods = [1, 2, 3, 4, 5, 6, 7, 8];

const timetable = {
  Mon: ["Maths - Mr. Sharma", "Physics - Ms. Gupta", "Chemistry - Dr. Singh", "English - Mrs. Rao", "Lunch", "CS - Mr. Kumar", "PE - Coach Raj", "Library"],
  Tue: ["English - Mrs. Rao", "Maths - Mr. Sharma", "Physics - Ms. Gupta", "Chemistry - Dr. Singh", "Lunch", "History - Mr. Das", "Art - Ms. Nair", "Club"],
  Wed: ["Chemistry - Dr. Singh", "English - Mrs. Rao", "Maths - Mr. Sharma", "Physics - Ms. Gupta", "Lunch", "CS - Mr. Kumar", "History - Mr. Das", "PE - Coach Raj"],
  Thu: ["Physics - Ms. Gupta", "Chemistry - Dr. Singh", "English - Mrs. Rao", "Maths - Mr. Sharma", "Lunch", "Art - Ms. Nair", "Library", "Club"],
  Fri: ["CS - Mr. Kumar", "History - Mr. Das", "Maths - Mr. Sharma", "PE - Coach Raj", "Lunch", "English - Mrs. Rao", "Physics - Ms. Gupta", "Chemistry - Dr. Singh"],
  Sat: ["Maths - Mr. Sharma", "English - Mrs. Rao", "CS - Mr. Kumar", "Art - Ms. Nair", "Lunch", "Club", "", ""],
};

export default function ChildTimetable() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Child's Timetable</h1>
        </div>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 text-left text-gray-600 dark:text-gray-300">Day</th>
                {periods.map(p => <th key={p} className="p-3 text-center text-gray-600 dark:text-gray-300">P{p}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {days.map(day => (
                <tr key={day} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-3 font-semibold text-gray-800 dark:text-white">{day}</td>
                  {periods.map(p => {
                    const val = timetable[day]?.[p - 1];
                    return (
                      <td key={p} className={`p-3 text-center ${val === "Lunch" ? "text-orange-500 dark:text-orange-300 font-semibold" : "text-gray-600 dark:text-gray-400"} ${!val ? "text-gray-300 dark:text-gray-600" : ""}`}>
                        {val || "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
