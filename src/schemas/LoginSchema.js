import * as yup from 'yup';
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,25}$/;
const errorMessage = 'use lowercase, uppercase  and digits';

const loginSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required('username is required'),
    password: yup.string().min(8).max(25).matches(passwordPattern,{message:errorMessage}).required('password is required')

});

export default loginSchema;
