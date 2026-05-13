const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
export const p = (src: string) => `${base}${src}`
