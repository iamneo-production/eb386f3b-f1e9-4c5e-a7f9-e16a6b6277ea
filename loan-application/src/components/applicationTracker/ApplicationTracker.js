import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApplicationsByUserIdAsync, selectApplications } from './appTrackerSlice'

function ApplicationTracker() {
    const dispatch = useDispatch();
    const applications = useSelector(selectApplications);

    useEffect(() => {
        dispatch(fetchApplicationsByUserIdAsync(1));
    }, [dispatch]);

    useEffect(() => {
        console.log(applications);
    }, [applications]);
    
  return (
    <Fragment>
        ApplicationTracker
    </Fragment>
  )
}

export default ApplicationTracker