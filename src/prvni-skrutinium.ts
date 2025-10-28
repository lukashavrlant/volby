import { assert } from "node:console";
import type { KrajPrvniSkrutinium, KrajSMandaty, Strana, StranaSMandaty, VysledekRepublikyPrvniSkrutinium, VysledekRepublikySPoctyMandatu } from "./types";

export function rozdelMandatyStranamDlePrvnihoSkrutinia(vysledky: VysledekRepublikySPoctyMandatu): VysledekRepublikyPrvniSkrutinium {
    return vysledky.map((kraj) => priradPrvniMandatyStranam(kraj));
}

function priradPrvniMandatyStranam(kraj: KrajSMandaty): KrajPrvniSkrutinium {
    const platneHlasy = setiHlasyStran(kraj);
    const krajskeVolebniCislo = platneHlasy / (kraj.pocetMandatu + 2);
    const stranySMandaty = priradMandatyStranam(kraj.strany, krajskeVolebniCislo);
    const pocetPridelenychMandatu = spocitejCelkovyPocetPridelenychMandatu(stranySMandaty);

    if (pocetPridelenychMandatu - kraj.pocetMandatu > 0) {
        console.log(`Rozdelili jsme moc mandatu!!! Meli jsme rozdelit ${kraj.pocetMandatu}, rozdelili jsme ${pocetPridelenychMandatu}`, stranySMandaty);
    }

    for (let i = 0; i < pocetPridelenychMandatu - kraj.pocetMandatu; i++) {
        console.log(`strane ${stranySMandaty[i].nazev} ubiram jeden mandat`);
        stranySMandaty[i].mandatyPrvniSkrutinium--;
    }

    const pocetPridelenychMandatuPoKorekci = spocitejCelkovyPocetPridelenychMandatu(stranySMandaty);

    assert(pocetPridelenychMandatuPoKorekci <= kraj.pocetMandatu);

    return {
        ...kraj,
        strany: stranySMandaty,
        pocetNeprirazenychMandatu: kraj.pocetMandatu - pocetPridelenychMandatuPoKorekci,
    };
}

function spocitejCelkovyPocetPridelenychMandatu(strany: ReadonlyArray<StranaSMandaty>): number {
    return strany.reduce((acc, item) => acc + item.mandatyPrvniSkrutinium, 0);
}

function priradMandatyStranam(strany: ReadonlyArray<Strana>, krajskeVolebniCislo: number): ReadonlyArray<StranaSMandaty> {
    return strany.map((strana) => spocitejMandaty(strana, krajskeVolebniCislo)).sort((a, b) => a.zbytekPoDeleni - b.zbytekPoDeleni);
}

function spocitejMandaty(strana: Strana, krajskeVolebniCislo: number): StranaSMandaty {
    return {
        ...strana,
        mandatyPrvniSkrutinium: Math.floor(strana.hlasy / krajskeVolebniCislo),
        zbytekPoDeleni: strana.hlasy % krajskeVolebniCislo,
    };
}

function setiHlasyStran(kraj: KrajSMandaty): number {
    return kraj.strany.reduce((p, c) => p + c.hlasy, 0);
}
