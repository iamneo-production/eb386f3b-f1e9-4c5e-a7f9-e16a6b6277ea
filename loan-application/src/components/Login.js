import { useFormik } from 'formik'
import * as Yup from "yup"
import '../styles/login.css'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Loginpage() {
    const navigate = useNavigate();
    const textVal = 'text';
    const passwordVal = 'password';
    const [errorData, setErrorData] = useState('');
    const [passwordVisisblity, setPasswordVisiblity] = useState(false);
    const formikForm = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().email('enter valid email').required('email is a required field'),
            password: Yup.string().required()
        }),
        onSubmit: (values) => {
            (async () => {
                // if not working https://ide-fbecccadeabdedfcebceacafcdfdaafcdadabbbdecf.project.examly.io/proxy/8080
                await axios.get('http://localhost:8080/credentials', { params: values }).then((res) => {
                    if (res.data.length > 0) {
                        const indexVal = res.data.findIndex(ele => {
                            return ele.email === values.email && ele.password === values.password;
                        });
                        if (indexVal !== -1) {
                            navigate('/');
                            //   window.location.reload();
                            setErrorData('');
                            localStorage.setItem('emailId', values.email)
                        } else {
                            setErrorData('Invalid Credentails');
                        }
                    } else {
                        setErrorData('Invalid Credentails');
                    }

                }).catch(err => {
                    console.log(err)
                })
            }
            )();

        },
    });
    const handlePasswordVisiblity = (visiblity) => {
        let passwordElement = document.getElementById('password-element')
        if (visiblity === true) {
            passwordElement.type = textVal;
        } else {
            passwordElement.type = passwordVal;
        }
        setPasswordVisiblity(visiblity);
    }
    return (
        <div className="login-container">
            <div className='form-container'>
                {errorData.length > 0 && <div className="error-container">{errorData}</div>}
                <div className='login-title'>Login</div>
                <form onSubmit={formikForm.handleSubmit}>
                    <input className='login-input-element' type='text' onChange={formikForm.handleChange}
                        onBlur={formikForm.handleBlur} name='email' value={formikForm.values.email}
                        placeholder='Email' />
                    <div className={formikForm.touched.email && formikForm.errors.email ? 'login-error-message' : ''}>{formikForm.touched.email && formikForm.errors.email ? formikForm.errors.email : ''}</div>
                    <br />
                    <input type='password' id='password-element' className='login-input-element' onChange={formikForm.handleChange} onBlur={formikForm.handleBlur}
                        name='password' onPaste={(event) => { event.preventDefault() }} value={formikForm.values.password}
                        placeholder='password' >
                    </input><i style={{ cursor: 'pointer' }} id='show-password' className={formikForm.values.password.length > 0 && passwordVisisblity ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}
                        onMouseUp={() => { handlePasswordVisiblity(false) }} onMouseDown={() => { handlePasswordVisiblity(true) }}></i>
                    <div className={formikForm.touched.password && formikForm.errors.password ? 'login-error-message' : ''}>{formikForm.touched.password && formikForm.errors.password ? formikForm.errors.password : ''}</div><br />
                    <button type='submit' className='button-class submit-button login-submit'>Submit</button> <br />

                </form >
            </div>
        </div >
    )
}