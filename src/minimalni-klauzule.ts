import type { Strana, VysledekRepublikySPoctyMandatu } from "./types";
import { sectiHlasy } from "./utils";

type NazvyStran = ReadonlyArray<string>;

export function vyfiltrujStranyKtereNesplnilyUzaviraciKlauzuli(vysledky: VysledekRepublikySPoctyMandatu): VysledekRepublikySPoctyMandatu {
    const celkovyPocetHlasu = sectiHlasy(vysledky);
    const uzaviraciKlauzule = 0.05 * celkovyPocetHlasu;
    const ziskyStran = sectiZiskyStranNapricRepublikou(vysledky);
    const stranyNadUzaviraciKlauzuli = vratStranyNadUzaviraciKlauzuli(ziskyStran, uzaviraciKlauzule);

    return vratRepublikoveVysledkySeStranamiKtereSplnujiUzaviraciKlauzuli(vysledky, stranyNadUzaviraciKlauzuli);
}

function vratRepublikoveVysledkySeStranamiKtereSplnujiUzaviraciKlauzuli(
    vysledky: VysledekRepublikySPoctyMandatu,
    nazvyStran: NazvyStran,
): VysledekRepublikySPoctyMandatu {
    return vysledky.map((kraj) => {
        return {
            ...kraj,
            strany: kraj.strany.filter((s) => nazvyStran.includes(s.nazev)),
        };
    });
}

function vratStranyNadUzaviraciKlauzuli(strany: ReadonlyArray<Strana>, uzaviraciKlauzule: number): NazvyStran {
    return strany.filter((s) => s.hlasy >= uzaviraciKlauzule).map((x) => x.nazev);
}

function sectiZiskyStranNapricRepublikou(vysledky: VysledekRepublikySPoctyMandatu): ReadonlyArray<Strana> {
    const strany: Record<string, number> = {};

    for (const strana of vysledky.flatMap((kraj) => kraj.strany)) {
        strany[strana.nazev] = (strany[strana.nazev] ?? 0) + strana.hlasy;
    }

    return Object.entries(strany).map((x) => ({ nazev: x[0], hlasy: x[1] }));
}
