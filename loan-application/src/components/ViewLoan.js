import axios from 'axios'
import '../styles/viewLoan.css'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DynamicDialog from '../components/DynamicDialog'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from "../redux/UserReducer";
export default function ViewLoan() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usersDetails = useSelector((state) => state.user.user);
    const [currentUserDetails, setCurrentUserDetails] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [buttonData, setButtonData] = useState([]);
    const [dialogTitle, setDialogTitle] = useState('')
    const { id } = useParams();
    const fileDatacolumns =
        [
            { field: 'name', headerName: 'File name', width: 80 },
            { field: 'size', headerName: 'File size', width: 80 }
        ]
    const [loanData, setloanData] = useState({});
    const loanBasicDetailTemplate = [
        { name: 'name', displayName: 'Applicant Name' },
        { name: 'dateOfBirth', displayName: 'Date of birth' },
        { name: 'gender', displayName: 'Gender' },
        { name: 'panId', displayName: 'PAN' },
        { name: 'email', displayName: 'Email' },
    ];
    const loanDetailTemplate = [
        { name: 'loanAmount', displayName: 'Loan Amount' },
        { name: 'loanTenure', displayName: 'Loan Tenure' },
        { name: 'intrestRate', displayName: 'Intrest Rate' },
        { name: 'totalAmount', displayName: 'Total Amount' },
        { name: 'emiAmount', displayName: 'EMI amount' }
    ];
    const branchDetailsTemplate = [
        { name: 'branch', displayName: 'Branch' },
        { name: 'loanOfficer', displayName: 'Loan Officer', },
        { name: 'status', displayName: 'status' }]
    useEffect(() => {
        const roleData = localStorage.getItem('role')
        if (roleData === 'CUSTOMER') {
            navigate('/')
        }
        const emailId = localStorage.getItem('emailId');
        if (usersDetails.length === 0) {
            dispatch(getUserDetails());
        } else {
            if (emailId && emailId.length > 0) {
                const dataVal = usersDetails.find(ele => ele.email === emailId);
                console.log(dataVal)
                setCurrentUserDetails(dataVal)
            }
            (async () => {
                await axios.get('http://localhost:8080/loanDetails', { params: { id: id } }).then(res => {
                    const loanDataVal = res.data[0];
                    setloanData(loanDataVal);
                }).catch(err => {
                    console.log(err)
                })
            })()
        }


    }, [id, dispatch, usersDetails, navigate])
    const handleOpenDialog = (content) => {
        setDialogContent(content);
        setOpenDialog(true);
    };

    const handleCloseDialog = (dataFromDialog) => {
        setOpenDialog(false);
        setDialogContent(null);
        if (dataFromDialog.selectedOption.length > 0) {
            console.log(dataFromDialog)
            const patchParams = dataFromDialog.selectedButton === 'Assigned' ? { loanOfficer: dataFromDialog.selectedOption, status: 'underwriting' } : { comments: dataFromDialog.selectedOption, status: dataFromDialog.selectedButton }
            axios.patch(`http://localhost:8080/loanDetails/${id}`, patchParams).then(res => {
                setloanData(res.data)
            }).catch(err => { console.log(err) })
        }
    };
    return (
        Object.keys(loanData).length > 0 && Object.keys(currentUserDetails).length > 0 && <div className='container'>
            <div className="row mb-2">
                <div className='subform-title'>Basic Details</div>
                {loanBasicDetailTemplate.map((ele, ind) => (
                    <div className='col mb-1' key={ind}>
                        <div className='loan-detail-title mb-1'>{ele.displayName} </div>
                        <div className='val'>{loanData[ele.name]}</div>
                    </div>
                ))}
            </div><br></br>
            <div className="row mb-2">
                <div className='subform-title'>Loan Details</div>
                {loanDetailTemplate.map((ele, ind) => (
                    <div className='col' key={ind}>
                        <div className='loan-detail-title'>{ele.displayName} </div>
                        <div className='val'>{loanData[ele.name]}</div>
                    </div>
                ))}
            </div>
            <div className="row mb-2">
                <div className='subform-title'>Branch Details</div>
                {branchDetailsTemplate.map((ele, ind) => (
                    <div className='col' key={ind}>
                        <div className='loan-detail-title'>{ele.displayName} </div>
                        <div className='val'>{loanData[ele.name]}</div>
                    </div>
                ))}
            </div>
            <div className="row mb-2">
                <div className='subform-title'>File Details</div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {fileDatacolumns.map((column) => (
                                    <TableCell className='loan-detail-title' key={column.field}>{column.headerName}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loanData[`uploadedFiles`].map((row, ind) => (
                                <TableRow key={ind}>
                                    {fileDatacolumns.map((column) => (
                                        <TableCell onClick={(eve) => { console.log('hi') }} key={column.field}>{row[column.field]}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="row">{console.log()}
                {((currentUserDetails.role === 'BANK_MANAGER' && currentUserDetails.branch === loanData.branch) || (currentUserDetails.role === 'LOAN_OFFICER' && currentUserDetails.name === loanData.loanOfficer)) && <div className='col button-container'>
                    {(currentUserDetails.role === 'BANK_MANAGER' && currentUserDetails.branch === loanData.branch) && <button className='btn btn-primary button-placement' onClick={() => { handleOpenDialog('assignLoanDialog'); setButtonData([loanData[`loanOfficer`] === '-' ? 'Assign' : 'Reassign']); setDialogTitle('Assign loan') }}>
                        {loanData[`loanOfficer`] === '-' ? 'Assign' : 'Reassign'}
                    </button>}

                    <DynamicDialog
                        open={openDialog}
                        dialogTitle={dialogTitle}
                        onClose={handleCloseDialog}
                        dialogContent={dialogContent}
                        dialogProps={currentUserDetails?.branchMembers ? currentUserDetails?.branchMembers : []}
                        buttonData={buttonData}
                    />
                    <button className='btn btn-primary button-placement' onClick={() => { handleOpenDialog('actionDialog'); setButtonData(['Reject', 'Approve']); setDialogTitle('Take action') }}>
                        Take action
                    </button>
                </div>}
            </div>
        </div>
    )
}
