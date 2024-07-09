import styles from './Login.module.css';
import TextInput from '../../components/TextInput/TextInput';
import loginSchema from '../../schemas/LoginSchema';
import { useFormik } from 'formik';
import { login } from '../../api/Internal';
import { setUser } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error,setError] = useState('');

    const handleLogin = async()=>{
        const data = {
            username: values.username,
            password:values.password
        }
        const response = await login(data);
        console.log(response,'ye hai apkay login ka repsonse')
        if(response.status === 200){
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth
            }
            console.log(dispatch(setUser(user),'dispatch(setUser(user)'));
            dispatch(setUser(user));
            navigate('/');
            
        }else if(response.code === 'ERR_BAD_REQUEST'){
            setError(response.response.data.message);

        }
        }

    const { values, touched, handleBlur, handleChange, errors} = useFormik({
        initialValues:{
            username: '',
            password: ''
        },
        validationSchema: loginSchema
    });
    return (
        <div className={styles.loginWrapper}>
            <div className={styles.loginHeader}>
              Login to your account
            </div>
            <TextInput
             type="text"
             value = {values.username}
             name = "username"
             onBlur={handleBlur}
             onChange = {handleChange}
             placeholder = "username"
             error = {errors.username && touched.username? 1:undefined  }
             errorMessage = {errors.username}
            />
            <TextInput 
             type="password"
             value = {values.password}
             name = "password"
             onBlur={handleBlur}
             onChange = {handleChange}
             placeholder = "password"
             error = {errors.username && touched.password? 1:undefined  }
             errorMessage = {errors.password}
             />
            <button 
            className={styles.loginButton} 
            onClick={handleLogin}
            disabled={ !values.username || !values.password || errors.username || errors.password } >Login</button>
            <span> Don't have an account? <button className={styles.createAccount} onClick={ ()=> navigate('/signup')}> Register</button></span>
            {error !="" ? <p className={styles.errorMessage}>{error}</p>:""}
        </div>
    )

}

export default Login;