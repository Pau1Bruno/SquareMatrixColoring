import { dSet } from '@/types/sets'; // Сортировка массива dSet по убыванию длины value

// Сортировка массива dSet по убыванию длины value
export const sortD = (dSets: dSet[]): dSet[] => {
    return dSets.sort((a, b) => b.value.length - a.value.length);
};

// Функция separateD: фильтрует отсортированные dSet, оставляя только те, где value содержит и i, и j
export const separateD = (sortedDSets: dSet[]): dSet[] => {
    return sortedDSets.filter(
        (ds) => ds.value.includes(ds.i) && ds.value.includes(ds.j)
    );
};

// Функция permutationMatrix: создаёт матрицу перестановки из перестановки и исходной матрицы
export const permutationMatrix = (
    permutation: number[],
    matrix: number[][]
): number[][] => {
    const permMatrix: number[][] = [];
    const length = permutation.length;
    for (const value of permutation) {
        const curRow = Array(length).fill(0);
        // Преобразуем строку исходной матрицы (value-1) в перестановочную строку:
        const yRow = matrix[value - 1]
            .map((el, index) => (el ? permutation.indexOf(index + 1) : -1))
            .filter((el) => el >= 0);
        for (const z of yRow) {
            curRow[z] = 1;
        }
        permMatrix.push(curRow);
    }
    return permMatrix;
};
