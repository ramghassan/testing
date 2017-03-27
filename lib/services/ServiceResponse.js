class ServiceResponse {
  constructor(err, errMessage, resp) {
      this.err = err,
      this.data = resp,
      this.errMessage = errMessage
  }
}
export default ServiceResponse;