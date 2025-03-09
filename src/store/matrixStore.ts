import { create } from 'zustand/react';

interface MatrixStore {
    dimension: number;
    weights: number[];
    matrix: number[][];
    setDimension: (dim: number) => void;
    updateWeight: (index: number, value: number) => void;
    setMatrix: (matrix: number[][]) => void;
}

export const useMatrixStore = create<MatrixStore>((set) => ({
    dimension: 0,
    weights: [],
    matrix: [],
    setDimension: (dim: number) =>
        set(() => ({
            dimension: dim,
            weights: Array(dim).fill(1),
            matrix: Array.from({ length: dim }, () =>
                Array.from({ length: dim }, () => 0)
            ),
        })),
    updateWeight: (index: number, value: number) =>
        set((state) => {
            const newWeights = [...state.weights];
            newWeights[index] = value;
            return { weights: newWeights };
        }),
    setMatrix: (matrix: number[][]) => set(() => ({ matrix })),
}));
