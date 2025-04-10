/**
 * Генерирует случайную симметричную матрицу смежности для ненаправленного графа.
 *
 * @param n - Число вершин графа.
 * @param density - Плотность графа (вероятность того, что между двумя вершинами появится ребро; значение от 0 до 1).
 * @returns Симметричная матрица смежности размером n x n. Диагональные элементы равны 0 (без петель).
 */
function generateUndirectedGraphMatrix(n: number, density: number): number[][] {
    // Инициализируем матрицу n x n, заполненную нулями
    const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    // Для каждой пары вершин (i, j) с i < j генерируем ребро с вероятностью density
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (Math.random() < density) {
                matrix[i][j] = 1;
                matrix[j][i] = 1; // Обеспечиваем симметричность, так как граф ненаправленный
            }
        }
    }
    return matrix;
}

/**
 * Генерирует набор матриц смежности для ненаправленных графов с заданными размерами и плотностями.
 *
 * @param sizes - Массив размеров графов (например, [10, 20, 50]), где каждый размер соответствует числу вершин.
 * @param densities - Массив значений плотности (например, [0.1, 0.3, 0.5, 0.8]), где значение от 0 до 1.
 * @param countPerCombination - (Опционально) Количество матриц, которые нужно сгенерировать для каждой комбинации (по умолчанию 1).
 * @returns Массив матриц смежности; каждая матрица представлена как двумерный массив чисел.
 */
export function generateAdjacencyMatrices(
    sizes: number[],
    densities: number[],
    countPerCombination: number = 1
): number[][][] {
    const matrices: number[][][] = [];
    // Проходим по каждому заданному размеру графа
    for (const n of sizes) {
        // Для каждого размера перебираем варианты плотности
        for (const density of densities) {
            // Для каждой комбинации генерируем countPerCombination матриц
            for (let count = 0; count < countPerCombination; count++) {
                const matrix = generateUndirectedGraphMatrix(n, density);
                matrices.push(matrix);
            }
        }
    }
    return matrices;
}
