import { join } from "path";

const { readFileSync } = require('fs');
const { parseStringPromise } = require('xml2js');
interface Strana {
    nazev: string;
    hlasy: number;
}
interface VysledekKraje {
    kraj: string;
    platneHlasy: number;
    strany: Strana[];
    prideleneMandatyPrvniKolo?: number;
}

type VysledekRepubliky = ReadonlyArray<VysledekKraje>;

const POCET_MANDATU = 200;

async function run() {
    const results = await parseResults();
    const vysledekRepubliky = results.sort((k1, k2) => k1.platneHlasy - k2.platneHlasy);
    const soucetHlasu = sectiHlasy(vysledekRepubliky);
    const republikoveMandatoveCislo = Math.round(soucetHlasu / POCET_MANDATU);
    const mandatyProKraje = vypoctiMandatyProKraje(vysledekRepubliky, republikoveMandatoveCislo);
    const pocetNepridelenychMandatuKrajum = spocitejPocetNepridelenychMandatuKrajum(mandatyProKraje);

    console.log(vysledekRepubliky);
    console.log({soucetHlasu, republikoveMandatoveCislo});
    console.log(mandatyProKraje);
    console.log({pocetNepridelenychMandatuKrajum})
}

function spocitejPocetNepridelenychMandatuKrajum(vysledekRepubliky: VysledekRepubliky): number {
    return POCET_MANDATU - vysledekRepubliky.reduce((p, c) => p + (c.prideleneMandatyPrvniKolo ?? 0), 0);
}

function vypoctiMandatyProKraje(vysledekRepubliky: VysledekRepubliky, republikoveMandatoveCislo: number) {
    return vysledekRepubliky.map(kraj => {
        return {
            ...kraj,
            prideleneMandatyPrvniKolo: Math.floor(kraj.platneHlasy / republikoveMandatoveCislo)
        }
    });
}

function sectiHlasy(vysledek: VysledekRepubliky): number {
    return vysledek.reduce((p, c) => p + c.platneHlasy, 0);
}

async function parseResults(): Promise<VysledekKraje[]> {
    const data = readFileSync(join('data', 'vysledky.xml'));
    // xml2js automaticky typuje výsledek na any, takže přidáváme kontrolu a type-guards
    const result = await parseStringPromise(data, { explicitArray: false }) as any;

    const krajeRaw = result?.VYSLEDKY?.KRAJ;

    // Ošetření pro případ, že v XML je pouze jeden kraj
    const kraje = Array.isArray(krajeRaw) ? krajeRaw : [krajeRaw];

    return kraje.map((kraj: any) => {
        const platneHlasy = parseInt(kraj.UCAST.$.PLATNE_HLASY, 10);
        const nazKraj = kraj.$.NAZ_KRAJ;
        const stranyArr = Array.isArray(kraj.STRANA) ? kraj.STRANA : [kraj.STRANA];

        const vysledkyStran: Strana[] = stranyArr.map((strana: any) => ({
            nazev: strana.$.NAZ_STR,
            hlasy: parseInt(strana.HODNOTY_STRANA.$.HLASY, 10)
        }));

        return {
            kraj: nazKraj,
            platneHlasy: platneHlasy,
            strany: vysledkyStran
        };
    });
}

run();
