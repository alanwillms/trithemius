interface ObjectWithId {
  id?: string
}

export function editTranslation({ id }: ObjectWithId) {
  // @fixme
  // this.$router.push({ name: 'edit_translation', params: { id } })
  window.location.href = `/translations/${id}`
}

export function calculateCompletenessPercentage(paragraphs: any[]) {
  const sum = (total: number, num: number) => {
    return total + num
  }
  const total = paragraphs.map(found => found.translation.length).reduce(sum, 0)
  const translated = paragraphs
    .filter(found => found.touched)
    .map(found => found.translation.length)
    .reduce(sum, 0)
  if (total === 0) {
    return 100
  }
  const percentage = (translated / total) * 100

  if (percentage > 100) {
    return 100
  }

  return percentage
}
