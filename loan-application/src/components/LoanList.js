import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import '../styles/loanlist.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from "../redux/UserReducer";
export default function LoanList() {
  const dispatch = useDispatch();
  const usersDetails = useSelector((state) => state.user.user);
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const navigate = useNavigate();
  const columns = [
    { field: 'id', headerName: 'Id', width: 160 },
    { field: 'name', headerName: 'Customer Name', width: 160 },
    { field: 'status', headerName: 'status', width: 160 },
    { field: 'loanOfficer', headerName: 'Loan Officer', width: 160 },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params) => <ViewCell params={params} />,
      width: 100,
    },
  ];
  const [rows, setRows] = useState([]);
  const ViewCell = ({ params }) => {
    return (
      <div className="view-button" onClick={() => handleViewClick(params.row.id)}>
        View
      </div>
    );
  };
  const handleViewClick = (rowId) => {
    console.log(rowId)
    navigate('/viewLoan/' + rowId)
    console.log('View clicked for row with ID:', rowId);
  };
  const emailId = localStorage.getItem('emailId');
  useEffect(() => {
    const roleData = localStorage.getItem('role');
    if (roleData === 'CUSTOMER') {
      navigate('/');
    }
    if (usersDetails.length === 0) {
      dispatch(getUserDetails());
    } else {
      if (emailId && emailId.length > 0) {
        const dataVal = usersDetails.find(ele => ele.email === emailId);
        setCurrentUserDetails(dataVal);
      }

      axios.get('http://localhost:8080/loanDetails').then((res) => {
        console.log(res.data)

        const branchData = res.data.filter(ele => ele.branch === currentUserDetails.branch);
        const rowData = branchData.map(ele => { return { id: ele.id, name: ele.name, status: ele.status, loanOfficer: ele.loanOfficer } })
        setRows(rowData)
      }).catch(err => {
        console.log(err)
      })
    }
  }, [currentUserDetails, emailId, dispatch, usersDetails, navigate]);
  return (
    (Object.keys(currentUserDetails).length > 0 && <div className='container mt-4 row m'>
      <div className='row table-container'>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight // This allows the table to adjust its height based on content
          pagination
          pageSize={2}
        />
      </div>
    </div>)
  )
}
