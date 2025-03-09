import { separateD, sortD } from "./helpers";
import { dSet, realmB, realmBArr } from "@/types/sets";

// Функция generateD: генерирует массив dSet для заданных горизонтальных и вертикальных множеств и множества omega
export const generateD = (
    horArr: number[][],
    verArr: number[][],
    omega: number[],
): dSet[] => {
    const dimension = horArr.length;
    const resArr: dSet[] = [];
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (i !== j && omega.includes(i + 1) && omega.includes(j + 1)) {
                // Фильтруем элементы горизонтального множества, оставляя те, которые есть и в вертикальном, и в omega
                const value = horArr[i].filter(
                    (el) => verArr[j].includes(el) && omega.includes(el),
                );
                resArr.push({ i: i + 1, j: j + 1, value });
            }
        }
    }
    // Сортируем по убыванию длины value
    sortD(resArr);
    // Фильтруем по условию: value должна содержать и i, и j
    return separateD(resArr);
};

// Функция generateOmegaMU: на основе исходного omega (ω^(1,0)), множества dSet и горизонтальных/вертикальных множеств генерирует:
//  - последовательности omega (массивы), dSet на каждом шаге,
//  - записи B1 и B2, а также формирует массив реальмов (realmB)
// Итоговый результат возвращается как объект типа realmBArr.
export const generateOmegaMU = (
    omega10: number[],
    sSet: dSet[],
    hor: number[][],
    ver: number[][],
): realmBArr => {
    // Инициализируем объект, который будем возвращать
    const allRealmsWithRecords: realmBArr = {
        realms: [],
        records: {
            B1: [],
            B2: [],
        },
    };

    let newOmega: number[];
    const newS = structuredClone(sSet) as dSet[];
    let currentD: dSet;

    // Для накопления итоговых записей (B1, B2) по лучшему реальму
    let bestB1: number[] = [],
        bestB2: number[] = [];

    // Массив реальмов, который будем заполнять (переименовано для избежания конфликта с типом)
    const realmsList: realmB[] = [];

    // Основной цикл по элементам newS (копия исходного множества dSet)
    for (let i = 0; i < newS.length; i++) {
        const curRealm: realmB = { B1: [], B2: [], omega: [], dSet: [] };
        // omegaArr будет содержать последовательность omega на каждом шаге
        const omegaArr: number[][] = [structuredClone(omega10) as number[]];
        // dArr будет содержать последовательность dSet, вычисленных на каждом шаге
        const dArr = structuredClone(sSet) as dSet[];
        const B1: number[] = [];
        let countB1 = 0;
        currentD = newS[i];
        newOmega = structuredClone(omega10) as number[];

        // Итеративно обновляем newOmega и накапливаем записи B1
        while (newOmega.length && newS.length) {
            // Обновляем newOmega: оставляем из currentD.value те элементы, которые не равны currentD.i или currentD.j и содержатся в newOmega
            newOmega = currentD.value
                ? currentD.value.filter((val) => val !== currentD.i && val !== currentD.j && newOmega.includes(val))
                : [];
            omegaArr.push(newOmega);

            // Если в currentD.value есть элементы – записываем оба индекса, иначе только currentD.i
            if (currentD.value.length) {
                B1.splice(countB1, 0, currentD.i, currentD.j);
            } else {
                B1.splice(countB1, 0, currentD.i);
            }

            if (!newOmega.length) break;

            // Вычисляем новое множество dSet для обновлённого newOmega
            const generatedD = generateD(hor, ver, newOmega);
            dArr.push(generatedD as unknown as dSet);

            // Берём первый элемент сгенерированного массива, либо создаём объект по умолчанию
            currentD = generatedD[0] ? generatedD[0] : { i: newOmega[0], j: -1, value: [] };
            countB1++;
        }
        curRealm.omega = omegaArr;
        curRealm.dSet = dArr;
        curRealm.B1 = B1;

        // Обрабатываем вторую часть: B2
        let omega2 = omega10.filter((el) => !B1.includes(el));
        let included = generateD(hor, ver, omega2);
        const B2: number[] = [];
        let countB2 = 0;

        if (!included.length) {
            B2.push(omega2[0]);
            omega2 = [];
        }

        let currentD2: dSet = included[0];
        while ((currentD2 && currentD2.value.length) || omega2.length) {
            if (!currentD2) {
                B2.splice(countB2, 0, omega2[0]);
                omega2.pop();
                break;
            }
            omega2 = currentD2.value.filter((val) => val !== currentD2.i && val !== currentD2.j && omega2.includes(val));
            B2.splice(countB2, 0, currentD2.i, currentD2.j);
            if (!omega2.length) break;
            included = generateD(hor, ver, omega2);
            currentD2 = included[0];
            countB2++;
        }
        curRealm.B2 = B2;

        // Обновляем лучшие записи, если сумма длины B1 и B2 больше
        if (B1.length + B2.length > bestB1.length + bestB2.length) {
            bestB1 = B1;
            bestB2 = B2;
        }

        realmsList.push(curRealm);
    }
    allRealmsWithRecords.realms = realmsList;
    allRealmsWithRecords.records = { B1: bestB1, B2: bestB2 };

    if (allRealmsWithRecords.records.B2[0] === undefined) {
        return { records: { B1: [], B2: [] }, realms: [] };
    }

    return allRealmsWithRecords;
};

// Функция generatePermutation: строит перестановку по следующей логике:
// сначала элементы, не входящие ни в B1, ни в B2, затем элементы B1, затем B2.
export const generatePermutation = (
    B1: number[],
    B2: number[],
    Im: number[],
): number[] => {
    const permutation: number[] = [];
    const w0 = Im.filter((el) => !B1.includes(el) && !B2.includes(el));
    w0.forEach((gi) => permutation.push(gi));
    B1.forEach((gi) => permutation.push(gi));
    B2.forEach((gi) => permutation.push(gi));
    return permutation;
};