export class MailgentApiError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = "MailgentApiError"
    this.status = status
    this.code = code
  }
}
