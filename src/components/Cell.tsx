import { BaseTextFieldProps, TextField } from '@mui/material';
import React from 'react';

interface ICellProps extends BaseTextFieldProps {
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    value?: number;
    disabled?: boolean;
}

export const Cell = ({ onChange, value, ...props }: ICellProps) => {
    return (
        <TextField
            type="number"
            variant="outlined"
            size="small"
            value={value}
            onChange={onChange}
            fullWidth
            sx={{
                height: '100%',
                '& .MuiOutlinedInput-root': {
                    height: '100%',
                },
            }}
            inputProps={{
                style: {
                    textAlign: 'center',
                    padding: 0,
                    height: '100%',
                },
                min: 0,
            }}
            {...props}
        />
    );
};
