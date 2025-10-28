import type { VysledekRepubliky } from "./types";

export function sectiHlasy(vysledek: VysledekRepubliky): number {
    return vysledek.reduce((p, c) => p + c.platneHlasy, 0);
}
