'use client';

import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Cell } from '@/components';
import { useMatrixStore } from '@/store/matrixStore';
import { firstMatrix, secondMatrix } from '@/algorithms';
import { greedyColoring } from '@/alternative/greedy';
import { dsaturColoring } from '@/alternative/dsatur';
import { geneticColoring } from '@/alternative/geneticColoring';
import { generateAdjacencyMatrices } from '@/algorithms/generateMatrices';

export interface GraphColoringResult {
    colors: number[];
    colorCount: number;
    conflicts?: [number, number][];
    isValid: boolean;
}

interface MatrixResult {
    matrix: number[][];
    greedy: GraphColoringResult;
    dsatur: GraphColoringResult;
    genetic: GraphColoringResult;
}

interface IMatrixProps {
    setIsCalculated: React.Dispatch<boolean>;
}

/**
 * Возвращает цвет из палитры по номеру (цикл по палитре)
 * @param num номер цвета
 */
const getColorForNumber = (num: number): string => {
    const palette = [
        '#FFCDD2',
        '#F8BBD0',
        '#E1BEE7',
        '#D1C4E9',
        '#C5CAE9',
        '#BBDEFB',
        '#B3E5FC',
        '#B2EBF2',
        '#B2DFDB',
        '#C8E6C9',
        '#DCEDC8',
        '#F0F4C3',
        '#FFF9C4',
        '#FFECB3',
        '#FFE0B2',
        '#FFCCBC',
        '#D7CCC8',
        '#CFD8DC',
    ];
    return palette[num % palette.length];
};

/**
 * Отображает визуальное представление раскраски:
 * каждая вершина представлена как квадрат с фоновым цветом,
 * соответствующим её назначению, и текстом с номером цвета.
 *
 * @param colors Массив цветов (номер для каждой вершины)
 */
const renderColoredGraph = (colors: number[]) => {
    const n = colors.length;
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${n}, 40px)`,
                gap: '4px',
                mb: 1,
            }}
        >
            {colors.map((col, i) => (
                <Box
                    key={i}
                    sx={{
                        backgroundColor: getColorForNumber(col),
                        height: '40px',
                        width: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #ccc',
                    }}
                >
                    <Typography variant="caption">{col}</Typography>
                </Box>
            ))}
        </Box>
    );
};

/**
 * Старая функция для рендеринга матрицы смежности (для справки).
 */
const renderMatrix = (matrix: number[][]) => {
    const n = matrix.length;
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${n}, 40px)`,
                gap: '4px',
                mb: 1,
            }}
        >
            {matrix.flat().map((value, index) => (
                <Box
                    key={index}
                    sx={{
                        border: '1px solid #ccc',
                        textAlign: 'center',
                        padding: '8px',
                        fontSize: '0.9rem',
                    }}
                >
                    {value}
                </Box>
            ))}
        </Box>
    );
};

/**
 * Обновлённая функция отображения результата для одной сгенерированной матрицы.
 * Для каждого алгоритма создаются отдельные визуальные представления раскрашенных вершин.
 */
const renderResult = (result: MatrixResult, idx: number) => {
    return (
        <Box
            key={idx}
            sx={{ mb: 4, border: '1px solid #eee', padding: '16px' }}
        >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Матрица {idx + 1} (Размер: {result.matrix.length}x
                {result.matrix.length})
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Исходная матрица смежности:
            </Typography>
            {renderMatrix(result.matrix)}

            {/* Визуальное отображение раскраски для каждого алгоритма */}
            <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Greedy:</strong> Цветов: {result.greedy.colorCount}
            </Typography>
            {renderColoredGraph(result.greedy.colors)}

            <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>DSATUR:</strong> Цветов: {result.dsatur.colorCount}
            </Typography>
            {renderColoredGraph(result.dsatur.colors)}

            <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Genetic:</strong> Цветов: {result.genetic.colorCount}
            </Typography>
            {renderColoredGraph(result.genetic.colors)}
        </Box>
    );
};

export const Matrix = ({ setIsCalculated }: IMatrixProps) => {
    const { matrix, setMatrix, dimension, setDimension } = useMatrixStore();
    const [results, setResults] = useState<MatrixResult[]>([]);

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
        // Генерация тестовых матриц
        const generatedMatrices = generateAdjacencyMatrices(
            [5, 6, 7, 8],
            [0.1, 0.3, 0.5, 0.8],
            3
        );
        // Для каждой матрицы вычисляем раскраску тремя методами
        const newResults: MatrixResult[] = generatedMatrices.map((m) => ({
            matrix: m,
            greedy: greedyColoring(m, false),
            dsatur: dsaturColoring(m, false),
            genetic: geneticColoring(
                m,
                { populationSize: 50, generations: 100, mutationRate: 0.1 },
                false
            ),
        }));
        setResults(newResults);
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
                    gridTemplateColumns: `repeat(${dimension}, 50px)`,
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
            {results.length > 0 && (
                <Box className="w-full mt-8">
                    <Typography variant="h6" className="mb-4">
                        Результаты раскраски для сгенерированных матриц
                    </Typography>
                    {results.map((result, idx) => renderResult(result, idx))}
                </Box>
            )}
        </Box>
    );
};
