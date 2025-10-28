import type { MandatyStran, VysledekRepubliky, VysledekRepublikyDruheSkrutinium } from "./types";

export function sectiHlasy(vysledek: VysledekRepubliky): number {
    return vysledek.reduce((p, c) => p + c.platneHlasy, 0);
}

export function sectiHlasyZPrvnihoADruhehoSkrutinia(vysledky: VysledekRepublikyDruheSkrutinium): MandatyStran {
    const mandatyStran: MandatyStran = {};

    for (const strana of vysledky.strany) {
        mandatyStran[strana.nazev] = (mandatyStran[strana.nazev] ?? 0) + strana.mandaty;
    }

    for (const kraj of vysledky.kraje) {
        for (const strana of kraj.strany) {
            mandatyStran[strana.nazev] = (mandatyStran[strana.nazev] ?? 0) + strana.mandatyPrvniSkrutinium;
        }
    }

    return mandatyStran;
}
