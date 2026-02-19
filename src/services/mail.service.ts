import Axios from './caller.service'

/**
 * Send mail service
 * @param firstName
 * @param lastName
 * @param email
 * @param message
 * @param phone
 * @returns {Promise<any>} Response data
 */
const sendMail = async (
  receiverEmail: string,
  receiverContent: string,
  receiverSubject: string,
  senderContent: string,
  senderSubject: string,
  senderEmail: string,
) => {
  try {
    const response = await Axios.put('/send-mail', {
      receiverEmail,
      receiverContent,
      receiverSubject,
      senderContent,
      senderSubject,
      senderEmail,
    })
    return response?.data
  } catch (error) {
    throw error
  }
}

export { sendMail }
