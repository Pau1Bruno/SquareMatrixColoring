// Функция horizontalSet: для каждой строки матрицы собирает номера столбцов, где стоит 0
export const horizontalSet = (matrix: number[][]): number[][] => {
    return matrix.map((row) =>
        row.reduce<number[]>((acc, val, j) => {
            if (val === 0) acc.push(j + 1);
            return acc;
        }, [])
    );
};

// Функция verticalSet: для каждого столбца матрицы собирает номера строк, где стоит 0
export const verticalSet = (matrix: number[][]): number[][] => {
    const n = matrix.length;
    const verSet: number[][] = Array.from({ length: n }, () => []);
    matrix.forEach((row, i) => {
        row.forEach((val, j) => {
            if (val === 0) verSet[j].push(i + 1);
        });
    });
    return verSet;
};

// Функция generateIm: создаёт массив от 1 до length (включительно)
export const generateIm = (length: number): number[] => {
    const Im = [];
    for (let i = 1; i <= length; i++) {
        Im.push(i);
    }
    return Im;
};

// Функция initialOmega: возвращает элементы из горизонтальных множеств, где множество содержит свой собственный индекс
export const initialOmega = (hor: number[][]): number[] => {
    return hor.reduce<number[]>((omega, set, index) => {
        if (set.includes(index + 1)) omega.push(index + 1);
        return omega;
    }, []);
};