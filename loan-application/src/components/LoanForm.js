import React, { useEffect, useState } from 'react';
import '../styles/loanform.css'
import * as Yup from 'yup'
import axios from 'axios'
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from "../redux/UserReducer";
import DragAndDropFileUpload from './CombinedFileUpload';
import { useNavigate } from 'react-router-dom';
export default function LoanForm({ userData }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const emailId = localStorage.getItem('emailId');
    const usersDetails = useSelector((state) => state.user.user);
    const [currentUserDetails, setCurrentUserDetails] = useState({});
    // const currentUserDetails = { name: 'balaji', dateOfBirth: '2023-05-22', gender: 'male', panId: 'ABXXX5XXXXC', email: 'balaji@gmail.com', branch: 'bangalore' }
    const formikForm = useFormik({
        initialValues: {
            loanAmount: '',
            loanTenure: '',
            intrestRate: '',
            uploadedFiles: [],
            totalAmount: '0',
            emiAmount: '0'
        },
        validationSchema: Yup.object({
            loanAmount: Yup.number().required('Enter loan amount'),
            loanTenure: Yup.number().required('Enter Tenure'),
            intrestRate: Yup.string().required('Select intrest rate'),
            uploadedFiles: Yup.array().required('upload required files'),
            totalAmount: Yup.string(),
            emiAmount: Yup.string()
        }
        ),
        onSubmit: (values) => {
            if (Object.keys(formikForm.errors).length === 0) {
                const paramData = { branch: formikForm.values.branch };
                let requestData = values;
                basicDetailFields.forEach(ele => {
                    requestData[ele.name] = currentUserDetails[ele.name];
                })
                axios.get('http://localhost:8080/LoanDetails', { params: { branch: formikForm.values.branch } }).then(res => {
                    if (res.data.length === 0) {
                        const numId = 1;

                        requestData.id = numId;
                    } else {
                        requestData.id = (res.data.length + 1);
                    }
                });
                requestData[`createdTime`] = new Date();
                requestData[`status`] = 'pending';
                requestData[`loanOfficer`] = '-'
                axios.post('http://localhost:8080/loanDetails', requestData).then(res => {
                    console.log(paramData.branch[0])
                    console.log(res)
                }).catch(err => {
                    console.log(err);
                })

            }
            console.log(values)
        }

    });
    const basicDetailFields = [
        { name: 'name', displayName: 'Applicant Name', type: 'text' },
        { name: 'dateOfBirth', displayName: 'Date of birth', type: 'date' },
        { name: 'gender', displayName: 'Gender', type: 'text' },
        { name: 'panId', displayName: 'PAN', type: 'text' },
        { name: 'email', displayName: 'Email', type: 'text' },
        { name: 'branch', displayName: 'Branch', type: 'text' }
    ];
    const removeFileName = (name, ind) => {
        console.log(name)
        const updatedFiles = formikForm.values.uploadedFiles.filter(ele => ele.name !== name);
        console.log(updatedFiles)
        formikForm.setFieldValue('uploadedFiles', updatedFiles);
    };
    const calculateAmount = () => {
        if (formikForm.values.intrestRate === 'fixed') {
            let intrestVal = (formikForm.values.loanAmount * formikForm.values.loanTenure * 10) / 100;
            let totalAmountVal = intrestVal + formikForm.values.loanAmount;
            totalAmountVal = Math.round(parseFloat(totalAmountVal) * 100) / 100;
            formikForm.setFieldValue('totalAmount', (totalAmountVal))
            let emiAmountVal = totalAmountVal / (formikForm.values.loanTenure * 12);
            emiAmountVal = Math.round(parseFloat(emiAmountVal) * 100) / 100;
            formikForm.setFieldValue('emiAmount', (emiAmountVal))
        } else {
            const expoVariableCalculation = (1 + (10 / 1200)) ** (formikForm.values.loanTenure * 12);
            let reducedIntToalEmi = ((formikForm.values.loanAmount * 10 * expoVariableCalculation) / ((expoVariableCalculation - 1) * 1200));
            reducedIntToalEmi = Math.round(parseFloat(reducedIntToalEmi) * 100) / 100;
            formikForm.setFieldValue('emiAmount', reducedIntToalEmi);
            let reducedRateAmount = reducedIntToalEmi * 12;
            reducedRateAmount = Math.round(parseFloat(reducedRateAmount) * 100) / 100;
            formikForm.setFieldValue('totalAmount', reducedRateAmount)
        }
    }
    useEffect(() => {
        const roleData = localStorage.getItem('role');
        if (roleData !== 'CUSTOMER') {
            navigate('/')
        }
        if (usersDetails.length === 0) {
            dispatch(getUserDetails());
        } else {
            if (emailId && emailId.length > 0) {
                const dataVal = usersDetails.find(ele => ele.email === emailId);
                setCurrentUserDetails(dataVal);
              
            }
        }
    }, [dispatch, usersDetails, emailId, currentUserDetails.role, navigate])
    console.log(formikForm)
    return Object.keys(currentUserDetails).length > 0 && (
        <div className='container loan-form-container'>
            <form onSubmit={formikForm.handleSubmit}>
                <div className='row mb-3 align-items-start'>
                    <div className='subform-title mb-3'>Basic Details</div>
                    {basicDetailFields.map((ele, ind) => (
                        <div className='col ' key={ind}>
                            <label htmlFor={ele.name} className="form-label">{ele.displayName}</label>
                            <input name={ele.name} onBlur={formikForm.handleBlur} disabled={currentUserDetails[ele.name] ? true : false} defaultValue={currentUserDetails[ele.name]} type={ele.type} className="form-control" id={ele.name} />
                        </div>
                    ))}
                </div>
                <div className='row mb-4 align-items-start'>
                    <div className='subform-title mb-3'>Loan Details</div>
                    <div className='col'>
                        <label htmlFor='loanAmount' className="form-label">Loan Amount</label>
                        <input name='loanAmount' onChange={formikForm.handleChange} onBlur={formikForm.handleBlur} value={formikForm.values.loanAmount} type='number' className="form-control" id='loanAmount' />
                        <div className={formikForm.touched.loanAmount && formikForm.errors.loanAmount ? 'row error-message' : ''}>{formikForm.touched.loanAmount && formikForm.errors.loanAmount ? formikForm.errors.loanAmount : ''}</div>
                    </div>
                    <div className='col'>
                        <label htmlFor='loanTenure' className="form-label">Loan Tenure</label>
                        <input name='loanTenure' onChange={formikForm.handleChange} onBlur={formikForm.handleBlur} value={formikForm.values.loanTenure} type='number' className="form-control" id='loanTenure' />
                        <div className={formikForm.touched.loanTenure && formikForm.errors.loanTenure ? 'row error-message' : ''}>{formikForm.touched.loanTenure && formikForm.errors.loanTenure ? formikForm.errors.loanTenure : ''}</div>
                    </div>
                    <div className='col'>
                        <label htmlFor='intrestRate' className="form-label">Intrest Rate</label><br></br>
                        <input onChange={formikForm.handleChange} name='intrestRate' className="form-check-input" type="radio" checked={formikForm.values.intrestRate === 'fixed'} value='fixed'></input><label className="form-label-checkbox">fixed</label>
                        <input onChange={formikForm.handleChange} name='intrestRate' className="form-check-input" type="radio" checked={formikForm.values.intrestRate === 'floating'} value='floating'></input><label className="form-label-checkbox">floating</label>
                    </div>
                </div >
                <div className="row mt-1 mb-1 align-items-start" >
                    <div className="col"> <label className='form-label'> Total Amount : {formikForm.values.totalAmount === 0 ? 0 : formikForm.values.totalAmount}</label></div>
                    <div className="col"><label className='form-label'> EMI : {formikForm.values.emiAmount === 0 ? 0 : formikForm.values.emiAmount}</label></div>
                    <div className="col">
                        <button className='btn btn-primary' type='button' onClick={() => {
                            if (formikForm.values.loanAmount > 0 && formikForm.values.loanTenure > 0 && formikForm.values.intrestRate.length > 0) {
                                calculateAmount();
                            }
                        }} >calculate</button>
                    </div>
                </div>

                <div className='row'>
                    <div className='subform-title mb-3' onBlur={formikForm.handleBlur}>Loan proofs</div>
                    <div className='col'>
                        <div className='subform-title mb-3'>Upload section</div>
                        <DragAndDropFileUpload onFilesSelected={(files) => {
                            const fileData = formikForm.values.uploadedFiles;
                            if (formikForm.values.uploadedFiles.length === 0) {
                                console.log(files[0])
                                fileData.push({ name: files[0].name, size: files[0].size });
                            } else {
                                const sameIndex = fileData.findIndex(ele => ele[0].name === files[0].name);
                                if (sameIndex === -1) {
                                    fileData.push(files); console.log(formikForm.values)
                                }
                            }
                            formikForm.setFieldValue('uploadedFiles', fileData);
                        }} />
                    </div>
                    <div className='col'>
                        <div className='subform-title mb-3'>File Details</div>
                        <div className={formikForm.errors && formikForm.values.uploadedFiles.length === 0 ? 'row error-message' : ''}>{formikForm.errors && formikForm.values.uploadedFiles.length === 0 ? 'upload necessary files' : ''}</div>

                        {formikForm.values.uploadedFiles.length > 0
                            &&
                            formikForm.values.uploadedFiles.map((ele, ind) => (
                                <span key={ind}
                                    className='file-name'>{ele.name}  <i onClick={() => removeFileName(ele.name)} className="bi bi-x-lg close-icon"></i> </span>
                            ))
                        }
                    </div>
                </div>
                <div className='row button-bar'>
                    <div className='col'>
                        <button type='button' className='btn btn-primary btn-position'>Cancel</button>
                        <button type='submit' className='btn btn-primary btn-position'>Submit</button>
                    </div>
                </div>
            </form >
        </div >
    )
}
