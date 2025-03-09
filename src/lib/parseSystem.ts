interface ParsedSystemMatrix {
    rowVariables: string[];    // e.g. ["y'", "z'"]
    columns: string[];         // e.g. ["a", "b", "c", "d"]
    matrix: number[][];        // row i => coefficients for rowVariables[i]
}

interface EquationData {
    leftVariable: string;              // e.g. "y'"
    rightSideCoefficients: Record<string, number>;
    // e.g. { a: 10, b: 10, c: -20, d: 2 }
}

/**
 * Parse a single equation of the form:
 *    <someVariable> =  [±]<coeff><variable> ± ...
 *
 * Example:
 *    "y' = 10a + 10b - 20c + 2d"
 *
 * Returns:
 * {
 *   leftVariable: "y'",
 *   rightSideCoefficients: { a: 10, b: 10, c: -20, d: 2 }
 * }
 */
export function parseEquation(equation: string): EquationData {
    // 1) Split by '=' into left-hand side (LHS) and right-hand side (RHS).
    const [lhsRaw, rhsRaw] = equation.split('=');
    if (!rhsRaw) {
        throw new Error(`Equation must contain '='. Got: "${equation}"`);
    }

    const lhs = lhsRaw.trim();  // e.g. "y'"
    const rhs = rhsRaw.trim();  // e.g. "10a + 10b - 20c + 2d"

    if (!lhs) {
        throw new Error(`Left side is empty in equation: "${equation}"`);
    }
    if (!rhs) {
        throw new Error(`Right side is empty in equation: "${equation}"`);
    }

    // 2) We'll store the LHS as a single variable name/string
    const leftVariable = lhs;

    // 3) Parse the right-hand side to find variable terms with optional numeric coefficients
    //
    // A pattern to capture [sign+digits or sign?digits?] + varName:
    //   "10a", "-20c", "+2d", ...
    //
    // Regex explanation:
    //   ([+\-]?\d*\.?\d*)?  -> an optional group capturing ± a possible float (like -2.5, +10, 3, etc.)
    //   ([a-zA-Z]\w*)       -> a variable name, e.g. 'a', 'b2', 'yPrime', 'x1', etc.
    //
    // We'll be liberal in letting variable names be [a-zA-Z]\w* so that "y'" won't quite match out of the box
    // because `'` is not a letter/digit/underscore.
    // However, for "y'", we are treating it as the *left* variable. For the right side we might not expect `'`.
    // If you do want to allow `'` in the variables on the right side, you can adjust the pattern below.
    //
    // We'll also handle the possibility that a user may omit the coefficient (implying ±1).
    //
    // But if you want to parse "y' = a'" on the right side, you'd have to allow `'` in the second group,
    // e.g. something like ([a-zA-Z]\w*('?)) or a custom approach.
    // For now, let's keep it simple and assume normal variable names for the right side.
    const varRegex = /([+\-]?\d*\.?\d*)([a-zA-Z]\w*)/g;

    const rightSideCoefficients: Record<string, number> = {};
    let match: RegExpExecArray | null;

    // We will also do a "cleanup" pass to remove spaces and unify + with coefficients.
    // E.g. "10a + 10b - 20c + 2d" => "10a+10b-20c+2d"
    const normalizedRHS = rhs.replace(/\s+/g, '');

    // 4) Find each "coefficient + variable" occurrence
    while ((match = varRegex.exec(normalizedRHS)) !== null) {
        const [fullMatch, coeffPart, varName] = match;
        let numericCoefficient: number;

        // If coeffPart is something like "" or "+", that implies +1
        // If coeffPart is "-", that implies -1
        // Otherwise parse the float
        if (coeffPart === '' || coeffPart === '+') {
            numericCoefficient = 1;
        } else if (coeffPart === '-') {
            numericCoefficient = -1;
        } else {
            numericCoefficient = parseFloat(coeffPart);
            if (isNaN(numericCoefficient)) {
                throw new Error(`Failed to parse numeric coefficient in "${fullMatch}" (equation: "${equation}")`);
            }
        }

        // Add to the dictionary. If the variable name is repeated, accumulate.
        if (!rightSideCoefficients[varName]) {
            rightSideCoefficients[varName] = numericCoefficient;
        } else {
            rightSideCoefficients[varName] += numericCoefficient;
        }
    }

    // 5) Optional: if you want to detect leftover text that didn't match, you can do a small check
    // by removing everything we matched from the normalizedRHS and seeing if there's something left.
    // (But for brevity, we skip that here.)

    return {
        leftVariable,
        rightSideCoefficients,
    };
}

export function parseSystem(equations: string[]): ParsedSystemMatrix {
    // 1) Parse each line individually
    const results = equations.map((eq) => parseEquation(eq));

    // 2) Collect the union of all variable names on the right sides
    const allRightVars = new Set<string>();
    for (const r of results) {
        for (const varName of Object.keys(r.rightSideCoefficients)) {
            allRightVars.add(varName);
        }
    }
    // Turn them into a sorted array (or keep them in insertion order if you prefer):
    const columns = Array.from(allRightVars).sort();

    // 3) Build the matrix row by row
    const matrix: number[][] = [];
    const rowVariables: string[] = [];

    for (const r of results) {
        rowVariables.push(r.leftVariable);
        // create a row with 0's for each column
        const row = columns.map((colVar) => {
            // if r.rightSideCoefficients has colVar, set that value; else 0
            return r.rightSideCoefficients[colVar] || 0;
        });

        const updatedRow = row.map(v => v === 0 ? 0 : 1)

        matrix.push(updatedRow);
    }

    return {
        rowVariables,
        columns,
        matrix,
    };
}

// EXAMPLE:
const systemEquations = [
    `y' = 10a + 10b - 20c + 2d`,
    `z = a - 3b + d`,
    // add more lines here...
];

const parsedSystem = parseSystem(systemEquations);
console.log(JSON.stringify(parsedSystem, null, 2));
/*
Example output:

{
  "rowVariables": [ "y'", "z'" ],
  "columns": ["a","b","c","d"],
  "matrix": [
    [10, 10, -20, 2],   // coefficients of (a,b,c,d) for y'
    [ 1, -3,   0, 1]    // coefficients of (a,b,c,d) for z'
  ]
}
*/
