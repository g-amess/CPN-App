import { QuizRunner } from '../components/QuizRunner'
import { useContent } from '../content/resolveContent'

export function OfficialQuiz() {
  const { sampleQuestions } = useContent()
  const n = sampleQuestions.length
  return (
    <div className="animate-fade-in">
      <QuizRunner
        questions={sampleQuestions}
        kind="official"
        title="Official Sample Quiz"
        intro={
          <>
            The {n} official sample question{n === 1 ? '' : 's'} from the exam guide — reproduced verbatim with{' '}
            {n === 1 ? 'its' : 'their'} correct answers and explanations. You get immediate feedback after each answer,
            and per-domain scoring at the end.
          </>
        }
      />
    </div>
  )
}
