import { RESPONSIBLE_AI_NOTICE } from '../constants/disclaimers'

/**
 * @typedef {object} PreliminaryAssessmentItem
 * @property {string} programName
 * @property {number} confidenceScore - 0 to 100
 * @property {string} matchReason
 * @property {string} [applicationTimeline]
 * @property {string} [officialLink]
 */

/**
 * @typedef {object} StrategicAdviceItem
 * @property {string} category
 * @property {string} advice
 */

/**
 * @typedef {object} JargonBusterItem
 * @property {string} term
 * @property {string} plainEnglishExplanation
 */

/**
 * @typedef {object} DocumentChecklistItem
 * @property {string} documentName
 * @property {string} reason
 */

/**
 * @typedef {object} ScholarshipResponse
 * @property {PreliminaryAssessmentItem[]} preliminaryAssessment
 * @property {StrategicAdviceItem[]} strategicAdvice
 * @property {JargonBusterItem[]} jargonBuster
 * @property {DocumentChecklistItem[]} documentChecklist
 * @property {string} responsible_ai_notice
 */

const clampScore = (score) => Math.max(0, Math.min(100, Number(score) || 0))

const asTrimmedString = (value, fallback = '') => {
  if (value === null || value === undefined) {
    return fallback
  }

  return String(value).trim()
}

/**
 * Normalizes raw Gemini (or adapter) output into the canonical ScholarshipResponse contract
 * consumed by the UI. All adapters should pass through this before reaching components.
 *
 * @param {unknown} raw
 * @returns {ScholarshipResponse}
 */
export const normalizeScholarshipResponse = (raw) => {
  if (!raw || typeof raw !== 'object') {
    throw new Error('[scholarshipResponse] Invalid response: expected an object')
  }

  const preliminaryAssessment = Array.isArray(raw.preliminaryAssessment)
    ? raw.preliminaryAssessment
        .map((item) => ({
          programName: asTrimmedString(item?.programName, 'Unnamed program'),
          confidenceScore: clampScore(item?.confidenceScore),
          matchReason: asTrimmedString(item?.matchReason),
          applicationTimeline: asTrimmedString(item?.applicationTimeline) || undefined,
          officialLink: asTrimmedString(item?.officialLink) || undefined,
        }))
        .filter((item) => item.programName)
    : []

  const strategicAdvice = Array.isArray(raw.strategicAdvice)
    ? raw.strategicAdvice
        .map((item) => ({
          category: asTrimmedString(item?.category, 'Advice'),
          advice: asTrimmedString(item?.advice),
        }))
        .filter((item) => item.advice)
    : []

  const jargonBuster = Array.isArray(raw.jargonBuster)
    ? raw.jargonBuster
        .map((item) => ({
          term: asTrimmedString(item?.term),
          plainEnglishExplanation: asTrimmedString(item?.plainEnglishExplanation),
        }))
        .filter((item) => item.term)
    : []

  const documentChecklist = Array.isArray(raw.documentChecklist)
    ? raw.documentChecklist
        .map((item) => {
          if (typeof item === 'string') {
            return { documentName: item.trim(), reason: '' }
          }

          return {
            documentName: asTrimmedString(item?.documentName),
            reason: asTrimmedString(item?.reason),
          }
        })
        .filter((item) => item.documentName)
    : []

  return {
    preliminaryAssessment,
    strategicAdvice,
    jargonBuster,
    documentChecklist,
    responsible_ai_notice: asTrimmedString(raw.responsible_ai_notice, RESPONSIBLE_AI_NOTICE),
  }
}
