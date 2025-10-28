import { assert } from "node:console";
import type { KrajPrvniSkrutinium, KrajSMandaty, Strana, StranaSMandaty, VysledekRepublikyPrvniSkrutinium, VysledekRepublikySPoctyMandatu } from "./types";

interface StranaPrvniSkrutinium extends StranaSMandaty {
    zbytekPoDeleni: number;
}

export function rozdelMandatyStranamDlePrvnihoSkrutinia(vysledky: VysledekRepublikySPoctyMandatu): VysledekRepublikyPrvniSkrutinium {
    return vysledky.map((kraj) => priradPrvniMandatyStranam(kraj));
}

function priradPrvniMandatyStranam(kraj: KrajSMandaty): KrajPrvniSkrutinium {
    const platneHlasy = setiHlasyStran(kraj);
    const krajskeVolebniCislo = platneHlasy / (kraj.pocetMandatu + 2);
    const prvniPokusMandaty = priradMandatyStranam(kraj.strany, krajskeVolebniCislo);
    const pocetPridelenychMandatu = spocitejCelkovyPocetPridelenychMandatu(prvniPokusMandaty);

    if (pocetPridelenychMandatu - kraj.pocetMandatu > 0) {
        console.log(`Rozdelili jsme moc mandatu!!! Meli jsme rozdelit ${kraj.pocetMandatu}, rozdelili jsme ${pocetPridelenychMandatu}`, prvniPokusMandaty);
    }

    for (let i = 0; i < pocetPridelenychMandatu - kraj.pocetMandatu; i++) {
        console.log(`strane ${prvniPokusMandaty[i].nazev} ubiram jeden mandat`);
        prvniPokusMandaty[i].mandatyPrvniSkrutinium--;
    }

    const pocetPridelenychMandatuPoKorekci = spocitejCelkovyPocetPridelenychMandatu(prvniPokusMandaty);

    assert(pocetPridelenychMandatuPoKorekci <= kraj.pocetMandatu);

    return {
        ...kraj,
        strany: prvniPokusMandaty,
    };
}

function spocitejCelkovyPocetPridelenychMandatu(strany: ReadonlyArray<StranaPrvniSkrutinium>): number {
    return strany.reduce((acc, item) => acc + item.mandatyPrvniSkrutinium, 0);
}

function priradMandatyStranam(strany: ReadonlyArray<Strana>, krajskeVolebniCislo: number): ReadonlyArray<StranaPrvniSkrutinium> {
    return strany.map((strana) => spocitejMandaty(strana, krajskeVolebniCislo)).sort((a, b) => a.zbytekPoDeleni - b.zbytekPoDeleni);
}

function spocitejMandaty(strana: Strana, krajskeVolebniCislo: number): StranaPrvniSkrutinium {
    return {
        ...strana,
        mandatyPrvniSkrutinium: Math.floor(strana.hlasy / krajskeVolebniCislo),
        zbytekPoDeleni: strana.hlasy % krajskeVolebniCislo,
    };
}

function setiHlasyStran(kraj: KrajSMandaty): number {
    return kraj.strany.reduce((p, c) => p + c.hlasy, 0);
}
