'use client';

import { Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import {
    generateD,
    generateIm,
    generateOmegaMU,
    generatePermutation,
    horizontalSet,
    initialOmega,
    permutationMatrix,
    separateD,
    verticalSet,
} from '@/algorithms';
import { Cell } from '@/components/Cell';

import { useMatrixStore } from '@/store/matrixStore';

export const Sets = () => {
    const { matrix, dimension } = useMatrixStore();

    // Вычисляем множества и перестановку, только если матрица и dimension заданы
    const setsData = useMemo(() => {
        if (!matrix || matrix.length === 0 || dimension <= 0) return null;

        // Вычисляем горизонтальные и вертикальные множества
        const horSet = horizontalSet(matrix);
        const verSet = verticalSet(matrix);

        // Начальное множество Ω^(1,0) рассчитывается по горизонтальным множествам
        const omega10: number[] = initialOmega(horSet);

        // Генерируем множество D и выделяем включённые элементы
        const dSets = generateD(horSet, verSet, omega10);
        const includedD = separateD(dSets);

        // Генерируем множество Im на основе количества горизонтальных множеств
        const Im = generateIm(horSet.length);

        // Вычисляем записи (B1, B2 и т.п.) с помощью функции generateOmegaMU
        const realmBArr = generateOmegaMU(omega10, includedD, horSet, verSet);

        // Вычисляем перестановку на основе записей и множества Im
        const permutation = generatePermutation(
            realmBArr.records.B1,
            realmBArr.records.B2,
            Im
        );

        // Вычисляем матрицу перестановки, используя исходную матрицу
        const permMatrix = permutationMatrix(permutation, matrix);

        // Вычисляем sharedGroup, если требуется для дальнейшего анализа
        const sharedGroup = Im.filter(
            (el) =>
                !realmBArr.records.B1.includes(el) &&
                !realmBArr.records.B2.includes(el)
        );

        return {
            horSet,
            verSet,
            omega10,
            includedD,
            Im,
            realmBArr,
            permutation,
            permMatrix,
            sharedGroup,
        };
    }, [matrix, dimension]);

    if (!setsData) return null;

    return (
        <Box className="mt-4 flex flex-col items-center">
            {/* Отображение горизонтальных и вертикальных множеств */}
            <Box className="grid grid-cols-2 gap-4">
                <Box>
                    <Typography variant="h6">
                        Горизонтальные множества:
                    </Typography>
                    {setsData.horSet.map((set, i) => (
                        <Typography key={`hor-${i}`} variant="subtitle1">
                            E<sub>{i + 1}</sub> ={' '}
                            {set.length ? `{${set.join(', ')}}` : '{∅}'}
                        </Typography>
                    ))}
                </Box>
                <Box>
                    <Typography variant="h6">
                        Вертикальные множества:
                    </Typography>
                    {setsData.verSet.map((set, i) => (
                        <Typography key={`ver-${i}`} variant="subtitle1">
                            H<sub>{i + 1}</sub> ={' '}
                            {set.length ? `{${set.join(', ')}}` : '{∅}'}
                        </Typography>
                    ))}
                </Box>
            </Box>

            {/* Отображение начального множества Ω^(1,0) */}
            <Box className="mt-4">
                <Typography variant="h6">
                    Ω<sup>(1,0)</sup> ={' '}
                    {setsData.omega10.length
                        ? `{${setsData.omega10.join(', ')}}`
                        : '{∅}'}
                </Typography>
            </Box>

            {/* Отображение записей B1 и B2 */}
            <Box className="mt-4 grid grid-cols-2 gap-4">
                <Typography variant="h6">
                    B1 = &#123;{setsData.realmBArr.records.B1.join(', ')}&#125;
                </Typography>
                <Typography variant="h6">
                    B2 = &#123;{setsData.realmBArr.records.B2.join(', ')}&#125;
                </Typography>
            </Box>

            {/* Отображение перестановки */}
            <Box className="mt-4">
                <Typography variant="h6">Перестановка:</Typography>
                <Typography variant="subtitle1">
                    {setsData.Im.join(' ')}
                </Typography>
                <Typography variant="subtitle1">
                    {setsData.permutation.join(' ')}
                </Typography>
            </Box>

            {/* Отображение матрицы перестановки */}
            <Box className="mt-4">
                <Typography variant="h6">Матрица перестановки:</Typography>
                <Box
                    className="grid gap-2"
                    style={{
                        gridTemplateRows: `repeat(${setsData.permMatrix.length}, 50px)`,
                        gridTemplateColumns: `repeat(${setsData.permMatrix.length}, 50px)`,
                    }}
                >
                    {setsData.permMatrix.map((row, i) =>
                        row.map((el, j) => (
                            <Cell key={`perm-${i}-${j}`} value={el} disabled />
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};
