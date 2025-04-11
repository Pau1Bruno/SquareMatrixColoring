interface GraphColoringResult {
    colors: number[];
    colorCount: number;
    conflicts?: [number, number][];
    isValid: boolean;
}

export const greedyColoring = (
    matrix: number[][],
    verbose: boolean = false
): GraphColoringResult => {
    const n = matrix.length;
    const colors: number[] = Array(n).fill(-1); // -1 означает, что вершина ещё не раскрашена
    let colorCount = 0; // счетчик использованных цветов

    for (let v = 0; v < n; v++) {
        const available: boolean[] = Array(n).fill(true);

        for (let u = 0; u < n; u++) {
            if (matrix[v][u] === 1 && colors[u] !== -1) {
                available[colors[u]] = false;
            }
        }

        let chosenColor = 0;
        while (chosenColor < n && !available[chosenColor]) {
            chosenColor++;
        }

        colors[v] = chosenColor;
        if (chosenColor === colorCount) {
            colorCount++;
        }

        if (verbose) {
            console.log(`greedyColoring: вершина ${v} -> цвет ${chosenColor}`);
        }
    }

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
            `greedyColoring: раскраска успешно выполнена ${colorCount} цветами, конфликтов нет.`
        );
    }
    if (verbose && !isValid) {
        console.log(
            `greedyColoring: обнаружены конфликты в раскраске! ${conflictEdges.length} конфликтующих пар.`
        );
    }

    return {
        colors,
        colorCount,
        isValid,
        ...(isValid ? {} : { conflicts: conflictEdges }),
    };
};
