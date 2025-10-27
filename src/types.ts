export interface Strana {
    nazev: string;
    hlasy: number;
}

export interface VysledekKraje {
    kraj: string;
    platneHlasy: number;
    strany: Strana[];
}

export interface KrajSMandaty extends VysledekKraje {
    pocetMandatu: number;
}

export type VysledekRepubliky = ReadonlyArray<VysledekKraje>;
export type VysledekRepublikySPoctyMandatu = ReadonlyArray<KrajSMandaty>;
