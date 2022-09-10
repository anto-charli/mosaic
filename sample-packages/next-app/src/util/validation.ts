const isEmptyString = (value: string) => value === ''


/* @namespace Util/validation/emailValidation*/
function emailValidation(props: { value: string }): Record<string, string | boolean> {
    const { value = '' } = props
    let isValid = false
    let message = ''
    const emailRegEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
    if (!isEmptyString(value)) {
      isValid = emailRegEx.test(value)
      if (!isValid) {
        message = 'Please enter a valid email'
      }
    } else {
      message = 'The email address cannot be blank.'
    }
  
    return {
      isValid,
      message,
    }
}

function passwordValidation(props: { value: string }): Record<string, string | boolean> {
  const { value = '' } = props
  let isValid = false
  let message = ''
  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

  if (!isEmptyString(value)) {
    isValid = passwordRegEx.test(value)
    if (!isValid) {
      message = 'Please enter a valid password'
    }
  } else {
    message = 'Password cannot be blank.'
  }

  return {
    isValid,
    message,
  }
}

  export { emailValidation, passwordValidation, isEmptyString }