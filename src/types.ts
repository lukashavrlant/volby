export interface Strana {
    nazev: string;
    hlasy: number;
}

export interface StranaSMandaty extends Strana {
    mandatyPrvniSkrutinium: number;
    zbytekPoDeleniVPrvnimSkrutiniu: number;
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

export interface StranaDruheSkrutinium {
    nazev: string;
    mandaty: number;
    zbytekPoDeleniVeDruhemSkrutiniu: number;
}

export type StranyDruheSkrutinium = ReadonlyArray<StranaDruheSkrutinium>;

export interface VysledekRepublikyDruheSkrutinium {
    kraje: VysledekRepublikyPrvniSkrutinium;
    strany: StranyDruheSkrutinium;
}
