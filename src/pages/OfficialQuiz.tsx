import { QuizRunner } from '../components/QuizRunner'
import { sampleQuestions } from '../content/sampleQuestions'

export function OfficialQuiz() {
  return (
    <div className="animate-fade-in">
      <QuizRunner
        questions={sampleQuestions}
        kind="official"
        title="Official Sample Quiz"
        intro={
          <>
            The 12 official sample questions from the exam guide — reproduced verbatim with their correct answers and
            explanations. You get immediate feedback after each answer, and per-domain scoring at the end.
          </>
        }
      />
    </div>
  )
}
