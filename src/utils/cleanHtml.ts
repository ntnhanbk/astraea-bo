import DOMPurify from 'dompurify'

const cleanHtml = (dirty: string) => {
  const clean = DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
  })
  return clean
}

export default cleanHtml
