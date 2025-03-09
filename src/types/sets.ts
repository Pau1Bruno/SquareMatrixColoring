export interface realmB {
    B1: number[];
    B2: number[];
    omega: any;
    dSet: dSet[];
}

export interface realmBArr {
    realms: realmB[];
    records: {
        B1: number[];
        B2: number[];
    };
}

export interface dSet {
    i: number;
    j: number;
    value: number[];
}
