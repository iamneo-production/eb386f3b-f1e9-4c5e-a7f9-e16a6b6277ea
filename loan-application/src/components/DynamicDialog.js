import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import '../App.css'
const DynamicDialog = ({ open, onClose, dialogContent, dialogTitle, dialogProps, buttonData }) => {
    const handleClose = (option) => {

        if (selectedOption.length > 0 || option === 'Cancel') {
            onClose({ selectedButton: option + 'ed', selectedOption: selectedOption });
            setSelectedOption('');
            setErrorMessageVisiblity(false)
        } else {
            setErrorMessageVisiblity(true)
        }
    };
    const [selectedOption, setSelectedOption] = useState('');
    const [errorMessageVisiblity, setErrorMessageVisiblity] = useState(false);
    const assignLoanTemplate = (
        <div className='col'>
            <FormControl fullWidth>

                <InputLabel id="dropdown-label">Select</InputLabel>
                <Select
                    labelId="dropdown-label"
                    id="dropdown"
                    label='select'
                    value={selectedOption}
                    onChange={(event) => { setSelectedOption(event.target.value); }}
                >
                    {dialogProps.map((option, ind) => (
                        <MenuItem key={ind} value={option.name}>
                            {option.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl ></div>)
    const actionDialogtemplate = (<div className='row'>
        <textarea placeholder="write your comments" onChange={(e) => setSelectedOption(e.target.value)} className='form-control'></textarea>
    </div>); console.log(dialogContent)
    return (
        <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>{dialogContent === 'assignLoanDialog' && assignLoanTemplate}
                {dialogContent === 'actionDialog' && actionDialogtemplate}
                {errorMessageVisiblity && <div className='error-message'>{dialogContent === 'assignLoanDialog' ? 'Select an option' : 'Enter comments'}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleClose('Cancel') }} color="primary">
                    Cancel
                </Button>
                {buttonData.map((ele, ind) => (
                    <Button key={ind} onClick={() => { handleClose(ele) }} color="primary">
                        {ele}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>
    );
};

export default DynamicDialog;
