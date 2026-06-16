export const formatMatchStrength = (strength) => {
  if (strength === 'High') {
    return 'Strong Match'
  }

  if (strength === 'Medium') {
    return 'Possible Match'
  }

  return 'Possible Match'
}