// import logo from './logo.svg';
// import './App.css';
// import ApplicationTracker from './components/applicationTracker/ApplicationTracker';

// function App() {
//   return (
//     <div className="App">
//       <ApplicationTracker />
//     </div>
//   );
// }

// export default App;



import "./App.css";
import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from 'react-router-dom';
import Header from "./components/common/Header";
import ApplicationTracker from "./components/applicationTracker/ApplicationTracker";
import SideBar from "./components/common/SideBar";
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from "./redux/UserReducer";
import LoanForm from './components/LoanForm'
import LoanList from './components/LoanList';
import ViewLoan from './components/ViewLoan';
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const dispatch = useDispatch();
  const usersDetails = useSelector((state) => state.user.user);
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [emailId, setEmailId] = useState('');
  const user = {
    name: "Thammayya",
    role: "BANK_MANAGER",
    id: "1",
  };
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    setEmailId(localStorage.getItem('emailId', emailId));
    if (emailId === null) {
      navigate('/login');
    } else {
      if (usersDetails.length === 0) {
        dispatch(getUserDetails());
      } else {
        if (emailId.length === 0) {
          navigate('/login');
        } else {
          const dataVal = usersDetails.find(ele => ele.email === emailId);
          console.log(dataVal)
          setCurrentUserDetails(dataVal)
          localStorage.setItem('role', currentUserDetails.role)
        }
      }
    }
  }, [usersDetails, dispatch, emailId, currentUserDetails, navigate])
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} user={user} />
      <SideBar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
        user={user}
      />
      <Link to='/applyLoan'>form</Link>
      <Routes>
        <Route path='/applyLoan' element={<LoanForm userData={currentUserDetails} ></LoanForm>}></Route>
        <Route path='loans' element={<LoanList></LoanList>}></Route>
        <Route path='viewLoan/:id' element={<ViewLoan></ViewLoan>}></Route>
      </Routes>
      {/* <ApplicationTracker /> */}
    </div>
  );
}
export default App;