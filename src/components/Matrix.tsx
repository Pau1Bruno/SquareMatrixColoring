'use client';

import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Cell } from '@/components';
import { useMatrixStore } from '@/store/matrixStore';
import { firstMatrix, secondMatrix } from '@/algorithms';

interface IMatrixProps {
    setIsCalculated: React.Dispatch<boolean>;
}

export const Matrix = ({ setIsCalculated }: IMatrixProps) => {
    const { matrix, setMatrix, dimension, setDimension } = useMatrixStore();

    const initMatrix = Array.from({ length: dimension }, () =>
        Array.from({ length: dimension }, () => 0)
    );

    const changeCellHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
        i: number
    ) => {
        const row = Math.floor(i / dimension);
        const copy = structuredClone(matrix);
        copy[row][i % dimension] = Number(e.target.value);
        setIsCalculated(false);
        setMatrix(copy);
    };

    const handleCalc = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsCalculated(true);
    };

    const handlePasteFirst = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const copy = structuredClone(firstMatrix);
        setDimension(copy.length);
        setMatrix(copy);
    };

    const handlePasteSecond = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const copy = structuredClone(secondMatrix);
        setDimension(copy.length);
        setMatrix(copy);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsCalculated(false);
        setMatrix(initMatrix);
    };

    return (
        <Box className="flex flex-col items-center my-4">
            <Typography variant="h6" className="mb-4">
                Структурная матрица исходной сис-мы:
            </Typography>
            <Box
                style={{
                    gridTemplateRows: `repeat(${dimension}, 50px)`,
                    gridTemplateColumns: `repeat(${dimension}, 50px`,
                }}
                className="grid gap-2"
            >
                {matrix?.length > 0 &&
                    Array.from({ length: dimension * dimension }).map(
                        (_, i) => (
                            <Cell
                                key={i}
                                onChange={(e) => changeCellHandler(e, i)}
                                value={
                                    matrix[Math.floor(i / dimension)][
                                        i % dimension
                                    ]
                                }
                            />
                        )
                    )}
            </Box>

            <Box className="flex mt-4 gap-4">
                <Button variant="contained" onClick={handlePasteFirst}>
                    Пример №1
                </Button>
                <Button variant="contained" onClick={handlePasteSecond}>
                    Пример №2
                </Button>
            </Box>
            <Box className="flex mt-4 gap-4">
                <Button variant="contained" color="error" onClick={handleClear}>
                    Очистить
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleCalc}
                >
                    Посчитать
                </Button>
            </Box>
        </Box>
    );
};
