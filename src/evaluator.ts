import { join } from "path";

const { readFileSync } = require('fs');
const { parseStringPromise } = require('xml2js');
// ... zbytek TypeScript kódu


// Typ popisující jednu stranu
interface Strana {
    nazev: string;
    hlasy: number;
}

// Typ popisující jeden kraj
interface VysledekKraje {
    kraj: string;
    platneHlasy: number;
    strany: Strana[];
}

async function run() {
    const results = await parseResults();
    console.log(results);
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
