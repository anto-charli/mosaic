import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement, Button, Stack, Container, Heading, Box } from '@chakra-ui/react';
import { EmailInputProps, PasswordInputProps, LoginBtnProps, InputProps } from './typings';
import { emailValidation } from 'Util/validation'
// import { toast } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify'

function getLoginInputProps () {
  return  {
    email: {
      isValid: false,
      isTouched: false,
      value: '',
      name: 'email',
      type: 'email',
      validation: emailValidation,
      errorMessage: ''
    } as InputProps,
    password: {
      // isValid: false,
      isTouched: false,
      value: '',
      name: 'password',
      type: 'password',
      errorMessage: ''
    } as InputProps
  }
}

function Login() {
  const defaultProps = getLoginInputProps()
  const [inputProps, setInputProps] = useState(defaultProps)

  const handleChange = (changeProps) => {
    const { name, value } = changeProps
    const tempProps = JSON.parse(JSON.stringify(defaultProps))
    Object.assign(tempProps, inputProps)
    const tempInput = tempProps[name]
    const validationFn = tempInput.validation
    tempInput.value = value
    tempInput.isTouched = true
    if(validationFn) {
      const validation = validationFn({value})
      tempInput.isValid = validation.isValid
      tempInput.errorMessage = validation.message
    }

    setInputProps(tempProps)
  }

    return (
        <Container maxW='container.sm' alignItems="center" flexWrap="wrap" justifyContent="space-around">
            <Stack spacing={3}>
                <Heading>Login</Heading>
                <EmailInput inputProps={inputProps.email} onChange={handleChange}/>
                <PasswordInput inputProps={inputProps.password} onChange={handleChange}/>
                <LoginBtn inputProps={inputProps}/>
            </Stack>
        </Container>
    )
}



function EmailInput(emailProps: EmailInputProps) {
    const { inputProps, onChange } = emailProps;

    const handleChange = (event) => {
      onChange?.({ name: inputProps?.name, value: event.target.value });
    }
    return (
      <>
        <Input variant='flushed' isInvalid={inputProps.isTouched && !inputProps.isValid} placeholder='Basic usage' size='lg' value={inputProps?.value} onChange={handleChange} />
        {
          inputProps?.errorMessage &&  
          <Box as='label' color='red.600' fontSize='sm'>
            { inputProps?.errorMessage }
          </Box>
        }
      </>
    )
}


function PasswordInput(passwordProps: PasswordInputProps) {
  const { inputProps, onChange } = passwordProps;

  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  const handleChange = (event) => {
    onChange?.({ name: inputProps?.name, value: event.target.value });
  }

  return (
    <>
      <InputGroup size='lg'>
        <Input
          variant='flushed'
          pr='4.5rem'
          type={show ? 'text' : 'password'}
          placeholder='Enter password'
          size='lg'
          value={inputProps?.value} onChange={handleChange}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
      {
        inputProps?.errorMessage &&  
        <Box as='label' color='red.600' fontSize='sm'>
          { inputProps?.errorMessage }
        </Box>
      }
    </>
  )
}

function LoginBtn(loginBtnProps: LoginBtnProps) {
  const { inputProps } = loginBtnProps

  const [isSuccess, setSuccess] = useState(false)

  const handleLogin = () => {
    let formInputs = Object.values(inputProps) as unknown as InputProps[]
    const isValidationSuccess = formInputs.every((formInput: InputProps) => {
      return formInput.isValid || (formInput.isValid == undefined && formInput.validation == undefined)
    })

    if(isValidationSuccess) {
      setSuccess(true)
    }
  }
  
  const onToggleClose = () => {
    setSuccess(false)
  }

  return  (
    <> 
      <Button bg='tomato' color='white' h='3rem' onClick={handleLogin} disabled={isSuccess}>Login</Button>
      <ShowLoginSuccess isSuccess={isSuccess} handleToggleClose={onToggleClose} />
    </>
  )
}

function ShowLoginSuccess(successProps: {isSuccess: boolean, handleToggleClose: (value: boolean) => void}){
  const { isSuccess, handleToggleClose } = successProps

  
  const notify = () => {
    toast('Login Success', {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => {
          handleToggleClose(false)
        }
      });
  }

  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      {isSuccess && notify()}
    </div>
  );
}

export default Login
export { Login }
