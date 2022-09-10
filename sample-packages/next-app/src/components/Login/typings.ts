import { ChangeEvent } from 'react';

interface OnChangeParams {
    name: string,
    value: string
}

interface InputProps {
    type: 'email' | 'password' | 'text',
    name: string, 
    isValid: boolean,
    isTouched: boolean,
    value: string,
    errorMessage: string,
    validation?: () => Record<string, string | boolean>
}

interface EmailInputProps {
    inputProps: InputProps,
    onChange?: (OnChangeParams) => void
}
  
interface PasswordInputProps extends EmailInputProps {

}

interface LoginBtnProps {
    inputProps: {
        [key: string]: InputProps,
    }
}

export { EmailInputProps, PasswordInputProps, LoginBtnProps, InputProps }