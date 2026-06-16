export const formatMatchStrength = (strength) => {
  if (strength === 'strong') {
    return 'Strong Match'
  }

  return 'Possible Match'
}

export const buildSourceByAuthority = (sources) => {
  return sources.reduce((accumulator, source) => {
    accumulator[source.label] = source.url
    return accumulator
  }, {})
}
