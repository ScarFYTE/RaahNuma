import { motion } from 'framer-motion'
import DocumentChecklist from './DocumentChecklist'
import JargonBuster from './JargonBuster'
import PreliminaryAssessment from './PreliminaryAssessment'

const OutputContainer = ({ sectionTitle, result, cardSources }) => {
  const animationProps = {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.3 },
  }

  return (
    <section className="space-y-4" aria-live="polite">
      <h2 className="text-xl font-semibold text-slate-900">{sectionTitle}</h2>

      <motion.div {...animationProps} transition={{ duration: 0.3, delay: 0.05 }}>
        <PreliminaryAssessment
          title={cardSources.preliminary.title}
          items={result.preliminary_assessment}
          source={cardSources.preliminary.source}
        />
      </motion.div>

      <motion.div {...animationProps} transition={{ duration: 0.3, delay: 0.15 }}>
        <JargonBuster
          title={cardSources.jargon.title}
          items={result.jargon_busters}
          source={cardSources.jargon.source}
        />
      </motion.div>

      <motion.div {...animationProps} transition={{ duration: 0.3, delay: 0.25 }}>
        <DocumentChecklist
          key={result.document_checklist.join('|')}
          title={cardSources.documents.title}
          items={result.document_checklist}
          source={cardSources.documents.source}
        />
      </motion.div>
    </section>
  )
}

export default OutputContainer
