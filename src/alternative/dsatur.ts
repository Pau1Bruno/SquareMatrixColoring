interface GraphColoringResult {
    colors: number[]; // цвет для каждой вершины
    colorCount: number; // общее число использованных цветов
    conflicts?: [number, number][]; // список конфликтующих пар вершин (если есть)
    isValid: boolean; // признак правильности раскраски (нет конфликтов)
}

export const dsaturColoring = (
    matrix: number[][],
    verbose: boolean = false
): GraphColoringResult => {
    const n = matrix.length;
    const colors: number[] = Array(n).fill(-1); // цвета вершин (-1 = нераскрашена)
    const degree: number[] = Array(n).fill(0); // степень (число соседей) каждой вершины
    const saturation: number[] = Array(n).fill(0); // степень насыщенности (разнообразие цветов соседей)
    const neighborColors: Array<Set<number>> = Array(n); // множество цветов соседей для каждой вершины
    for (let i = 0; i < n; i++) {
        neighborColors[i] = new Set<number>();
        // вычисляем степень вершины i
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 1) {
                degree[i]++;
            }
        }
    }

    let coloredCount = 0;
    let colorCount = 0;
    while (coloredCount < n) {
        // Выбрать нераскрашенную вершину с максимальной насыщенностью (и степенью при равенстве)
        let bestVertex = -1;
        let maxSat = -1;
        let maxDeg = -1;
        for (let v = 0; v < n; v++) {
            if (colors[v] !== -1) continue; // пропустить уже раскрашенные
            const sat = saturation[v];
            if (sat > maxSat || (sat === maxSat && degree[v] > maxDeg)) {
                maxSat = sat;
                maxDeg = degree[v];
                bestVertex = v;
            }
        }

        // Назначить минимально возможный цвет вершине bestVertex
        let chosenColor = 0;
        const usedByNeighbors = neighborColors[bestVertex]; // множество цветов, занятых соседями
        while (usedByNeighbors.has(chosenColor)) {
            chosenColor++;
        }
        colors[bestVertex] = chosenColor;
        if (chosenColor === colorCount) {
            // если выбрали новый цвет (равный текущему количеству цветов), увеличиваем счетчик цветов
            colorCount++;
        }
        coloredCount++;
        if (verbose) {
            console.log(
                `dsaturColoring: вершина ${bestVertex} -> цвет ${chosenColor} (насыщенность=${maxSat}, степень=${degree[bestVertex]})`
            );
        }

        // Обновить насыщенности соседей выбранной вершины
        for (let u = 0; u < n; u++) {
            if (matrix[bestVertex][u] === 1 && colors[u] === -1) {
                // вершина u соседняя и еще не раскрашена
                if (!neighborColors[u].has(chosenColor)) {
                    neighborColors[u].add(chosenColor);
                    saturation[u]++; // увеличиваем степень насыщенности u на 1 (новый цвет добавлен в ее соседей)
                }
            }
        }
    }

    // Проверка корректности раскраски
    const conflictEdges: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (matrix[i][j] === 1 && colors[i] === colors[j]) {
                conflictEdges.push([i, j]);
            }
        }
    }
    const isValid = conflictEdges.length === 0;
    if (verbose && isValid) {
        console.log(
            `dsaturColoring: раскраска завершена ${colorCount} цветами, конфликтов нет.`
        );
    }
    if (verbose && !isValid) {
        console.log(
            `dsaturColoring: обнаружены конфликты, количество конфликтующих пар: ${conflictEdges.length}.`
        );
    }

    return {
        colors,
        colorCount,
        isValid,
        ...(isValid ? {} : { conflicts: conflictEdges }),
    };
};
