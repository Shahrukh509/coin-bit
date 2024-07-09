import * as yup from 'yup';

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,25}$/;
const errorMessage = 'use lowercase, uppercase  and digits';
const signupSchema = yup.object().shape({
    name: yup.string().max(30).required('Name field is required'),
    username:yup.string().max(5).required('Username field is required') ,
    email:yup.string().email('Enter a valid email').required('Email field is required'),
    password: yup.string().min(8).max(25).matches(passwordPattern,{message:errorMessage}).required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')],'passwords must match').required('Confirm password field is required'),

});

export default signupSchema;