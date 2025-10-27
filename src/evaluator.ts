import { join } from "path";
import type { Strana, VysledekRepubliky } from "./types";
import { vyhodnotPocetMandatuProKraje } from "./vypocet-poctu-krajskych-mandatu";

const { readFileSync } = require("fs");
const { parseStringPromise } = require("xml2js");

async function run() {
    const results = await parseResults();
    const vysledekRepubliky = [...results].sort((k1, k2) => k1.platneHlasy - k2.platneHlasy);

    console.log(vysledekRepubliky.map(x => ({kraj: x.kraj, platneHlasy: x.platneHlasy})));

    const vysledkySMandaty = vyhodnotPocetMandatuProKraje(vysledekRepubliky);

    console.log(vysledkySMandaty.map(x => ({kraj: x.kraj, pocetMandatu: x.pocetMandatu})));
}

async function parseResults(): Promise<VysledekRepubliky> {
    const data = readFileSync(join("data", "vysledky.xml"));
    // xml2js automaticky typuje výsledek na any, takže přidáváme kontrolu a type-guards
    const result = (await parseStringPromise(data, {
        explicitArray: false,
    })) as any;

    const krajeRaw = result?.VYSLEDKY?.KRAJ;

    return krajeRaw.map((kraj: any) => {
        const platneHlasy = parseInt(kraj.UCAST.$.PLATNE_HLASY, 10);
        const nazKraj = kraj.$.NAZ_KRAJ;
        const stranyArr = Array.isArray(kraj.STRANA) ? kraj.STRANA : [kraj.STRANA];

        const vysledkyStran: Strana[] = stranyArr.map((strana: any) => ({
            nazev: strana.$.NAZ_STR,
            hlasy: parseInt(strana.HODNOTY_STRANA.$.HLASY, 10),
        }));

        return {
            kraj: nazKraj,
            platneHlasy: platneHlasy,
            strany: vysledkyStran,
        };
    });
}

run();
