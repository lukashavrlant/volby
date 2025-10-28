import { assert } from "node:console";
import { StranyDruheSkrutinium, VysledekRepublikyDruheSkrutinium, VysledekRepublikyPrvniSkrutinium } from "./types";

interface StranaZbytek {
    nazev: string;
    zbytekPoDeleniZPrvnihoSkrutinia: number;
}

type ZbytkyStran = ReadonlyArray<StranaZbytek>;

export function rozdelMandatyStranamDleDruhehoSkrutinia(vysledky: VysledekRepublikyPrvniSkrutinium): VysledekRepublikyDruheSkrutinium {
    const celkovyPocetNeprirazenychMandatu = spocitejCelkovyPocetNeprirazenychMandatu(vysledky);
    const zbytkyZPrvnihoSkrutinia = sectiStranamZbytekHlasuZPrvnihoSkrutinia(vysledky);
    const soucetZbytku = sectiZbytky(zbytkyZPrvnihoSkrutinia);
    const republikoveVolebniCislo = soucetZbytku / (celkovyPocetNeprirazenychMandatu + 1);

    const zakladniMandatyStran = priradZbyleMandaty(zbytkyZPrvnihoSkrutinia, republikoveVolebniCislo);
    const prirazeneMandatyVPrvnimKoleDruhehoSkrutinia = sectiMandaty(zakladniMandatyStran);

    console.log({ celkovyPocetNeprirazenychMandatu, soucetZbytku, republikoveVolebniCislo, prirazeneMandatyVPrvnimKoleDruhehoSkrutinia });

    for (let i = 0; i < celkovyPocetNeprirazenychMandatu - prirazeneMandatyVPrvnimKoleDruhehoSkrutinia; i++) {
        zakladniMandatyStran[i].mandaty++;
    }

    for (let i = 0; i < prirazeneMandatyVPrvnimKoleDruhehoSkrutinia - celkovyPocetNeprirazenychMandatu; i++) {
        const index = zakladniMandatyStran.length - 1 - i;
        zakladniMandatyStran[index].mandaty--;
    }

    const pocetMandatuPoKorekci = sectiMandaty(zakladniMandatyStran);

    assert(pocetMandatuPoKorekci === celkovyPocetNeprirazenychMandatu);

    return {
        kraje: vysledky,
        strany: zakladniMandatyStran,
    };
}

function sectiMandaty(strany: StranyDruheSkrutinium): number {
    return strany.reduce((acc, item) => acc + item.mandaty, 0);
}

function priradZbyleMandaty(zbytkyZPrvnihoSkrutinia: ZbytkyStran, republikoveVolebniCislo: number): StranyDruheSkrutinium {
    return zbytkyZPrvnihoSkrutinia
        .map((strana) => {
            return {
                nazev: strana.nazev,
                mandaty: Math.floor(strana.zbytekPoDeleniZPrvnihoSkrutinia / republikoveVolebniCislo),
                zbytekPoDeleniVeDruhemSkrutiniu: strana.zbytekPoDeleniZPrvnihoSkrutinia % republikoveVolebniCislo,
            };
        })
        .sort((a, b) => b.zbytekPoDeleniVeDruhemSkrutiniu - a.zbytekPoDeleniVeDruhemSkrutiniu);
}

function spocitejCelkovyPocetNeprirazenychMandatu(vysledky: VysledekRepublikyPrvniSkrutinium): number {
    return vysledky.reduce((acc, item) => acc + item.pocetNeprirazenychMandatu, 0);
}

function sectiZbytky(zbytky: ZbytkyStran): number {
    return zbytky.reduce((acc, item) => acc + item.zbytekPoDeleniZPrvnihoSkrutinia, 0);
}

function sectiStranamZbytekHlasuZPrvnihoSkrutinia(vysledky: VysledekRepublikyPrvniSkrutinium): ZbytkyStran {
    const strany: Record<string, number> = {};

    for (const kraj of vysledky) {
        for (const strana of kraj.strany) {
            strany[strana.nazev] = (strany[strana.nazev] ?? 0) + strana.zbytekPoDeleniVPrvnimSkrutiniu;
        }
    }

    return Object.entries(strany).map((x) => ({ nazev: x[0], zbytekPoDeleniZPrvnihoSkrutinia: x[1] }));
}
