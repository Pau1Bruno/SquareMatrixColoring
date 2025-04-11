interface GraphColoringResult {
    colors: number[];
    colorCount: number;
    conflicts?: [number, number][];
    isValid: boolean;
}

/**
 * Оценивает фитнес (качество) раскраски.
 * Функция возвращает объект с:
 * - fitness: итоговый балл (чем меньше, тем лучше);
 * - conflicts: число конфликтующих пар вершин;
 * - colorCount: число использованных различных цветов.
 */
export function evaluateFitness(matrix: number[][], chromosome: number[]): { fitness: number; conflicts: number; colorCount: number } {
    const n = matrix.length;
    let conflicts = 0;
    // Подсчет конфликтов: для каждой пары вершин (i, j), где i < j
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (matrix[i][j] === 1 && chromosome[i] === chromosome[j]) {
                conflicts++;
            }
        }
    }
    const colorCount = new Set(chromosome).size;
    // Фитнес: конфликты имеют высокий штраф (каждый конфликт добавляет n+1)
    const fitness = conflicts * (n + 1) + colorCount;
    return { fitness, conflicts, colorCount };
}

/**
 * Создает случайную хромосому – раскраску графа.
 * Для каждой вершины выбирается случайный цвет из диапазона 0..n-1.
 */
export function randomChromosome(n: number): number[] {
    const chromosome: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
        chromosome[i] = Math.floor(Math.random() * n);
    }
    return chromosome;
}

export function tournamentSelect(fitnessData: { fitness: number }[], populationSize: number): number {
    const i1 = Math.floor(Math.random() * populationSize);
    const i2 = Math.floor(Math.random() * populationSize);
    return fitnessData[i1].fitness <= fitnessData[i2].fitness ? i1 : i2;
}

/**
 * Одноточечный кроссовер двух родительских хромосом.
 * Разрез происходит в случайной точке, после чего образуются два потомка.
 */
export function crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const n = parent1.length;
    const crossoverPoint = Math.floor(Math.random() * n);
    const child1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    const child2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));
    return [child1, child2];
}

/**
 * Применяет мутацию к хромосоме.
 * Для каждой вершины с вероятностью mutationRate цвет изменяется на случайное значение.
 */
export function mutate(chromosome: number[], mutationRate: number, n: number): number[] {
    const mutated = chromosome.slice();
    for (let i = 0; i < n; i++) {
        if (Math.random() < mutationRate) {
            mutated[i] = Math.floor(Math.random() * n);
        }
    }
    return mutated;
}

export const geneticColoring = (
    matrix: number[][],
    params: {
        populationSize?: number;
        generations?: number;
        mutationRate?: number;
    } = {},
    verbose: boolean = false
): GraphColoringResult => {
    const n = matrix.length;
    const populationSize = params.populationSize ?? 50;
    const generations = params.generations ?? 100;
    const mutationRate = params.mutationRate ?? 0.1;

    // Инициализация начальной популяции
    let population: number[][] = [];
    for (let p = 0; p < populationSize; p++) {
        population.push(randomChromosome(n));
    }

    // Переменные для отслеживания лучшего решения
    let bestChromosome: number[] = [];
    let bestFitness = Infinity;
    let bestConflicts = Infinity;
    let bestColorCount = Infinity;

    // Эволюционный цикл
    for (let gen = 1; gen <= generations; gen++) {
        // Оценка приспособленности текущей популяции
        const fitnessData = population.map(chrom => evaluateFitness(matrix, chrom));

        // Обновление лучшего решения
        for (let i = 0; i < populationSize; i++) {
            const { fitness, conflicts, colorCount } = fitnessData[i];
            if (fitness < bestFitness) {
                bestFitness = fitness;
                bestConflicts = conflicts;
                bestColorCount = colorCount;
                bestChromosome = population[i].slice();
                if (verbose) {
                    console.log(`Поколение ${gen}: новое лучшее решение – конфликтов: ${conflicts}, цветов: ${colorCount}`);
                }
            }
        }

        // Опционально: можно завершить, если конфликтов нет
        if (bestConflicts === 0) {
            // Не прерываем цикл, чтобы попытаться уменьшить число цветов
        }

        // Формирование нового поколения
        const newPopulation: number[][] = [];
        // Элитарное копирование: если размер популяции нечётный, добавляем лучшее решение
        if (populationSize % 2 === 1) {
            newPopulation.push(bestChromosome.slice());
        }

        while (newPopulation.length < populationSize) {
            // Турнирный отбор родительских индексов
            const idx1 = tournamentSelect(fitnessData, populationSize);
            const idx2 = tournamentSelect(fitnessData, populationSize);
            const parent1 = population[idx1];
            const parent2 = population[idx2];

            // Кроссовер для генерации двух потомков
            const [child1, child2] = crossover(parent1, parent2);

            // Применяем мутацию к потомкам
            const mutatedChild1 = mutate(child1, mutationRate, n);
            const mutatedChild2 = mutate(child2, mutationRate, n);

            newPopulation.push(mutatedChild1);
            if (newPopulation.length < populationSize) {
                newPopulation.push(mutatedChild2);
            }
        }

        population = newPopulation;
        if (verbose) {
            console.log(`Поколение ${gen} завершено (лучший фитнес: ${bestFitness}, конфликтов: ${bestConflicts}, цветов: ${bestColorCount})`);
        }
    }

    // Формируем список конфликтов для итогового решения, если они остались
    const conflictEdges: [number, number][] = [];
    if (bestConflicts > 0) {
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (matrix[i][j] === 1 && bestChromosome[i] === bestChromosome[j]) {
                    conflictEdges.push([i, j]);
                }
            }
        }
    }
    const isValid = bestConflicts === 0;
    if (verbose) {
        if (isValid) {
            console.log(`Результат: корректная раскраска без конфликтов, использовано цветов: ${bestColorCount}`);
        } else {
            console.log(`Результат: лучшая найденная раскраска имеет ${bestConflicts} конфликтов при ${bestColorCount} цветах.`);
        }
    }
    return {
        colors: bestChromosome,
        colorCount: bestColorCount,
        isValid,
        ...(isValid ? {} : { conflicts: conflictEdges }),
    };
};
