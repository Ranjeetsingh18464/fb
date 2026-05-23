import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

export default function Quizzes() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, "quizzes"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [grade, section]);

  const startQuiz = (q) => {
    setCurrentQuiz(q);
    setAnswers({});
    setScore(null);
  };

  const submitQuiz = () => {
    if (!currentQuiz) return;
    let correct = 0;
    currentQuiz.questions.forEach(q => { if (answers[q.id] === q.correct) correct++; });
    setScore(correct);
  };

  if (currentQuiz && score === null) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setCurrentQuiz(null)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{currentQuiz.title}</h1>
          </div>
          <div className="space-y-4">
            {(currentQuiz.questions || []).map((q, i) => (
              <div key={q.id || i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <p className="font-semibold text-gray-800 dark:text-white mb-2">{i + 1}. {q.text}</p>
                <div className="space-y-2">
                  {(q.options || []).map((opt, oi) => (
                    <label key={oi} className={`block p-2 rounded cursor-pointer ${answers[q.id] === oi ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                      <input type="radio" name={`q${q.id}`} checked={answers[q.id] === oi} onChange={() => setAnswers({ ...answers, [q.id]: oi })} className="mr-2" />{opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={submitQuiz} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Quiz</button>
        </div>
      </div>
    );
  }

  if (score !== null) {
    const total = (currentQuiz?.questions || []).length;
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => { setCurrentQuiz(null); setScore(null); }} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quiz Result</h1>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{score} / {total}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Percentage: {total ? ((score / total) * 100).toFixed(0) : 0}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quizzes</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No quizzes available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {quizzes.map(q => (
              <div key={q.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center">
                <div><h3 className="font-semibold text-gray-800 dark:text-white">{q.title}</h3><p className="text-sm text-gray-500">{(q.questions || []).length} questions</p></div>
                <button onClick={() => startQuiz(q)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Start</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}