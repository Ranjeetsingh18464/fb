import React, { useState } from 'react';

const createdQuizzes = [
  { id: 1, title: 'Algebra Quiz 1', class: '10A', subject: 'Mathematics', questions: 10, timeLimit: 30, published: true },
  { id: 2, title: 'Geometry Basics', class: '10B', subject: 'Mathematics', questions: 8, timeLimit: 20, published: true },
  { id: 3, title: 'Trigonometry Test', class: '9A', subject: 'Mathematics', questions: 12, timeLimit: 45, published: false },
  { id: 4, title: 'Statistics Quiz', class: '9B', subject: 'Mathematics', questions: 10, timeLimit: 30, published: false },
];

export default function Quizzes() {
  const [title, setTitle] = useState('');
  const [quizClass, setQuizClass] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correct: 0 }]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correct: 0 }]);
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleCreate = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quizzes</h1>
        <p>Create and manage quizzes for your classes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Create Quiz</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
              <input type="text" className="input-field w-full" placeholder="Enter quiz title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select className="input-field w-full" value={quizClass} onChange={(e) => setQuizClass(e.target.value)}>
                  <option value="">Select</option>
                  <option>10A</option><option>10B</option><option>9A</option><option>9B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="input-field w-full" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option>Mathematics</option><option>Science</option><option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time (min)</label>
                <input type="number" className="input-field w-full" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} min={5} max={180} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Questions</label>
                <button type="button" className="text-blue-600 text-sm hover:underline" onClick={addQuestion}>+ Add Question</button>
              </div>
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Question {qIdx + 1}</span>
                    {questions.length > 1 && (
                      <button type="button" className="text-red-500 text-xs hover:underline" onClick={() => removeQuestion(qIdx)}>Remove</button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="input-field w-full mb-2"
                    placeholder="Enter question text"
                    value={q.text}
                    onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                  />
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correct === oIdx}
                        onChange={() => updateQuestion(qIdx, 'correct', oIdx)}
                      />
                      <input
                        type="text"
                        className="input-field flex-1"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button type="submit" className="btn-primary w-full">Create Quiz</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Created Quizzes</h3>
          <div className="space-y-3">
            {createdQuizzes.map((quiz) => (
              <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{quiz.title}</h4>
                  <span className={`badge-${quiz.published ? 'success' : 'warning'} text-xs`}>
                    {quiz.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{quiz.class} • {quiz.subject}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{quiz.questions} questions</span>
                  <span>{quiz.timeLimit} min</span>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-blue-600 hover:underline">{quiz.published ? 'Unpublish' : 'Publish'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
