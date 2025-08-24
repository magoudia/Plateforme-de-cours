import React, { useState } from 'react';

const questions = [
  {
    id: 1,
    text: 'Quel est le type de x = 5 ?',
    options: ['str', 'int', 'float', 'bool'],
    correct: 'int',
    explanation: 'int est le type des nombres entiers.'
  },
  {
    id: 2,
    text: 'Comment convertir "12.5" en float ?',
    options: [
      'float("12,5") (virgule invalide)',
      'float("12.5")',
      'str_to_float("12.5") (n\'existe pas)'
    ],
    correct: 'float("12.5")',
    explanation: 'Utilisez float() avec un point décimal.'
  },
  {
    id: 3,
    text: 'Que fait ce code ?\nfor i in range(3):\n    print(i)',
    options: ['Affiche 0 1 2', 'Affiche 1 2 3', 'Boucle infinie'],
    correct: 'Affiche 0 1 2',
    explanation: 'range(3) génère 0, 1, 2.'
  },
  {
    id: 4,
    text: 'Quel mot-clé arrête une boucle immédiatement ?',
    options: ['stop', 'break', 'exit'],
    correct: 'break',
    explanation: "break permet d'arrêter une boucle immédiatement."
  },
  {
    id: 5,
    text: "Quelle fonction calcule le carré d'un nombre ?\ndef carre(n):\n    return n ** 2\ncarre(4) → ?",
    options: ['carre(4) → 16', 'carre(4) → 8', 'carre(4) → 44'],
    correct: 'carre(4) → 16',
    explanation: 'carre(4) retourne 16 car 4 ** 2 = 16.'
  }
];

const QuizPythonInteractif: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (qid: number, value: string) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let sc = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) sc++;
    });
    setScore(sc);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Quiz interactif en Python</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={q.id} className="mb-6">
            <div className="mb-2 font-semibold">
              {idx + 1}. <span dangerouslySetInnerHTML={{__html: q.text.replace(/\n/g, '<br/>')}} />
            </div>
            <div className="space-y-2">
              {q.options.map(opt => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                    disabled={submitted}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {submitted && (
              <div className={
                answers[q.id] === q.correct
                  ? 'mt-2 text-green-600'
                  : 'mt-2 text-red-600'
              }>
                {answers[q.id] === q.correct ? 'Bonne réponse !' : 'Mauvaise réponse.'} <br/>
                <span className="text-gray-700">{q.explanation}</span>
              </div>
            )}
          </div>
        ))}
        {!submitted ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            disabled={Object.keys(answers).length !== questions.length}
          >
            Valider
          </button>
        ) : (
          <div className="text-center">
            <div className="text-xl font-bold mb-2">Score : {score} / {questions.length}</div>
            <button
              type="button"
              onClick={resetQuiz}
              className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Recommencer
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuizPythonInteractif; 