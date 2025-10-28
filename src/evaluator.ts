import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseStringPromise } from "xml2js";
import { vyfiltrujStranyKtereNesplnilyUzaviraciKlauzuli } from "./minimalni-klauzule";
import type { Strana, VysledekRepubliky } from "./types";
import { vyhodnotPocetMandatuProKraje } from "./vypocet-poctu-krajskych-mandatu";

async function run() {
    const results = await parseResults();
    const vysledekRepubliky = [...results].sort((k1, k2) => k1.platneHlasy - k2.platneHlasy);

    const vysledkySMandaty = vyhodnotPocetMandatuProKraje(vysledekRepubliky);
    const vysledkyUspesnychStran = vyfiltrujStranyKtereNesplnilyUzaviraciKlauzuli(vysledkySMandaty);

    console.log(JSON.stringify(vysledkyUspesnychStran, null, 4));
}

async function parseResults(): Promise<VysledekRepubliky> {
    const data = readFileSync(join("data", "vysledky.xml"));

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
