const {readFileSync} = require('fs');
const xml2js = require('xml2js');

run();

async function run() {
    const results = await parseResults();
    console.log(results);
}

async function parseResults() {
    const data = readFileSync('vysledky.xml');

    const result = await xml2js.parseStringPromise(data, { explicitArray: false });

    const kraje = result['VYSLEDKY']['KRAJ'];

    return kraje.map(kraj => {
        const platneHlasy = parseInt(kraj['UCAST']['$']['PLATNE_HLASY'], 10);
        const nazKraj = kraj['$']['NAZ_KRAJ'];
        const strany = Array.isArray(kraj['STRANA']) ? kraj['STRANA'] : [kraj['STRANA']];

        const vysledkyStran = strany.map((strana) => ({
            nazev: strana['$']['NAZ_STR'],
            hlasy: parseInt(strana['HODNOTY_STRANA']['$']['HLASY'], 10)
        }));

        return({
            kraj: nazKraj,
            platneHlasy: platneHlasy,
            strany: vysledkyStran
        });
    });
}
