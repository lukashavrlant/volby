import { POCET_MANDATU } from "./constants";
import type { VysledekKraje, VysledekRepubliky, VysledekRepublikySPoctyMandatu } from "./types";

interface MezivypocetKraj extends VysledekKraje {
    prideleneMandatyPrvniKolo: number;
    zbytekHlasuZPrvnihoKola: number;
    prideleneMandatyDruheKolo: number;
}

type MezivypocetRepublika = Array<MezivypocetKraj>;

export function vyhodnotPocetMandatuProKraje(vysledekRepubliky: VysledekRepubliky): VysledekRepublikySPoctyMandatu {
    const soucetHlasu = sectiHlasy(vysledekRepubliky);
    const republikoveMandatoveCislo = Math.round(soucetHlasu / POCET_MANDATU);
    console.log({soucetHlasu, republikoveMandatoveCislo});
    const mezivypocet = vypoctiMandatyProKraje(vysledekRepubliky, republikoveMandatoveCislo);
    return priradZbyleMandatyKrajum(mezivypocet);
}

function sectiHlasy(vysledek: VysledekRepubliky): number {
    return vysledek.reduce((p, c) => p + c.platneHlasy, 0);
}

function vypoctiMandatyProKraje(vysledekRepubliky: VysledekRepubliky, republikoveMandatoveCislo: number): MezivypocetRepublika {
    
    return vysledekRepubliky.map((kraj) => {
        return {
            ...kraj,
            prideleneMandatyPrvniKolo: Math.floor(kraj.platneHlasy / republikoveMandatoveCislo),
            zbytekHlasuZPrvnihoKola: kraj.platneHlasy % republikoveMandatoveCislo,
            prideleneMandatyDruheKolo: 0,
        };
    });
}

function priradZbyleMandatyKrajum(vysledekRepubliky: MezivypocetRepublika): VysledekRepublikySPoctyMandatu {
    const pocetNepridelenychMandatuKrajum = spocitejPocetNepridelenychMandatuKrajum(vysledekRepubliky);

    vysledekRepubliky.sort((a, b) => b.zbytekHlasuZPrvnihoKola - a.zbytekHlasuZPrvnihoKola);

    for (let i = 0; i < pocetNepridelenychMandatuKrajum; i++) {
        vysledekRepubliky[i].prideleneMandatyDruheKolo = 1;
    }

    console.log({pocetNepridelenychMandatuKrajum});

    console.log(vysledekRepubliky.map(x => ({...x, strany: undefined})));

    return vysledekRepubliky.map((kraj) => {
        return {
            kraj: kraj.kraj,
            platneHlasy: kraj.platneHlasy,
            strany: kraj.strany,
            pocetMandatu: kraj.prideleneMandatyPrvniKolo + kraj.prideleneMandatyDruheKolo,
        };
    });
}

function spocitejPocetNepridelenychMandatuKrajum(vysledekRepubliky: MezivypocetRepublika): number {
    return POCET_MANDATU - vysledekRepubliky.reduce((p, c) => p + c.prideleneMandatyPrvniKolo, 0);
}
