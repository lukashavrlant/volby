export interface Strana {
    nazev: string;
    hlasy: number;
}

export interface StranaSMandaty extends Strana {
    mandatyPrvniSkrutinium: number;
    zbytekPoDeleni: number;
}

export interface VysledekKraje {
    kraj: string;
    platneHlasy: number;
    strany: Strana[];
}

export interface KrajPrvniSkrutinium {
    kraj: string;
    platneHlasy: number;
    strany: ReadonlyArray<StranaSMandaty>;
    pocetNeprirazenychMandatu: number;
}

export interface KrajSMandaty extends VysledekKraje {
    pocetMandatu: number;
}

export type VysledekRepubliky = ReadonlyArray<VysledekKraje>;
export type VysledekRepublikySPoctyMandatu = ReadonlyArray<KrajSMandaty>;
export type VysledekRepublikyPrvniSkrutinium = ReadonlyArray<KrajPrvniSkrutinium>;
