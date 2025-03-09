'use client';

import { Box, Typography } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { Cell } from '@/components/Cell';
import { useMatrixStore } from '@/store/matrixStore';

interface IDimensionProps {
    setIsCalculated: React.Dispatch<boolean>;
}

export const Dimension = ({ setIsCalculated }: IDimensionProps) => {
    const { dimension, setDimension, weights, updateWeight } = useMatrixStore();

    const changeCellHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        i: number
    ) => {
        setIsCalculated(false);
        updateWeight(i, +e.target.value);
    };

    return (
        <Box className="flex flex-col gap-4">
            <Box className="flex justify-center items-center gap-4">
                <Typography className="text-nowrap" variant="h6" component="h6">
                    Выберите размерность:
                </Typography>
                <Box className="w-[50px] h-[50px]">
                    <Cell
                        id="dimension"
                        defaultValue={0}
                        value={dimension}
                        onChange={(e) => {
                            setIsCalculated(false)
                            setDimension(+e.target.value);
                        }}
                    />
                </Box>
            </Box>
            <Box className="flex justify-center gap-4">
                {weights.map((weight, index) => (
                    <Box key={`weight-${index}`} className="w-[50px] h-[50px]">
                        <Cell
                            id={`weight-${index}`}
                            onChange={(e) => changeCellHandler(e, index)}
                            defaultValue={1}
                            value={weight}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
