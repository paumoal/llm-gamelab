const fs = require('fs');
const { findlegals } = require('./player'); // Importar findlegals desde symbol.js
const { findinits, play, findterminalp, start, simulate } = require('./player')
const {
    acons,
    adjoin,
    adjoinit,
    amongp,
    arg1,
    arg2,
    assoc,
    backup,
    baseapply,
    baseapplybuiltin,
    baseapplylist,
    baseapplymath,
    baseapplyrs,
    baseanswers,
    basefindg,
    basefindn,
    basefindp,
    basefinds,
    basefindx,
    basesome,
    basesomeand,
    basesomeatom,
    basesomebase,
    basesomedistinct,
    basesomeground,
    basesomenot,
    basesomeor,
    basesomesame,
    basesomeview,
    baseunindex,
    bitand,
    bitior,
    bitlsh,
    bitnot,
    bitxor,
    callconjunction,
    calldistinct,
    calleval,
    callevaluation,
    callmember,
    callnegation,
    callsame,
    car,
    cdr,
    cons,
    delistify,
    dropfact,
    eliminatefacts,
    eliminaterules,
    envlookupfacts,
    eval,
    factindexps,
    find,
    findp,
    first,
    flatindex,
    flatunindex,
    freevarsexp,
    fullindex,
    fullunindex,
    getbases,
    getdate,
    getfactarity,
    getrulearity,
    getviews,
    getyear,
    head,
    index,
    indexps,
    indexsymbol,
    insertfact,
    insertrule,
    kif,
    len,
    list,
    makedefinition,
    makeequality,
    makeinequality,
    makenegation,
    maketransition,
    numberize,
    plugvar,
    plugexp,
    remfact,
    remcontent,
    reverse,
    rplaca,
    rplacd,
    scan,
    seq,
    stripquotes,
    stringify,
    symbolize,
    tail,
    unify,
    unindexsymbol,
    variance,
    symbolp,
    append,
    binaryappend,
    debugfindn,
    debugfindp,
    debugfinds,
    debugfindx,
    fastread,
    fastreaddata,
    fastreaditems,
    getdataset,
    getlength,
    getmonth,
    getsecond,
    grindspaces,
    hastype,
    kifexp,
    kifparenlist,
    listify,
    makeexistential,
    midrange,
    minimum,
    newsymbolize,
    read,
    readitems,
    scanstring,
    tracecall,
    traceexit,
    untrace,
    uniquify,
    zniquify,
    definemorerules,
    readdata,
    definerules,
    //compfinds,
    nil,
    nullp,
    lookuprules,
    indexees,
    compfindp,
    compfindx,
    compfinds,
    compfindn,
    compfindg,
    sortfinds,
    compvalue,

} = require('./epilog');

const args = process.argv.slice(2); //utilizar los argumentos desde python

const [role, moveJson, game, _state] = args;

const move = JSON.parse(moveJson);

const state = JSON.parse(_state)

// Leer el archivo .hrf
//tictactoe
//const rulesFilePath = './rulesheets/rulesheet_tictactoe.hrf';
//const stylesheetPath = './stylesheets/stylesheet_tictactoe.js';

//alquerque
const rulesFilePath = `./downloads/${game}_rulesheet.hrf`;
const stylesheetPath = `./downloads/${game}_stylesheet.js`;

indexing = false;
dataindexing = false;
ruleindexing = true;

var library = [];
//var state = [];

var rulesheet = fs.readFileSync(rulesFilePath, 'utf8');
definerules(library, readdata(rulesheet));
var stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
try { eval(stylesheet) } catch (err) {
    // console.log('stylesheet error.') 
};

// Verificar los movimientos legales para el rol actual antes de realizar el movimiento
var legalMoves = findlegals(state, library); // findlegals ahora está disponible
//console.log('Movimientos legales para el rol:', role, legalMoves);

var movimientoValido = legalMoves.some(subarray =>
    JSON.stringify(subarray) === JSON.stringify(move)
);

//console.log(state)

if (movimientoValido) {
    //console.log('El movimiento es válido:', move);

    var iniciar = start(role, library, 10, 10)

    //console.log(iniciar)
    // Simular el movimiento
    try {
        var state_ = simulate(move, state, library); // Simular el movimiento
        //console.log({ move, newstate: state_ })
        var win = 0
        if (findterminalp(state_, library)) {
            win = 1
        }
        //console.log('Estado después del movimiento:', JSON.stringify(state_, null, 2));
        //console.log(JSON.stringify({ 'board': state_, 'legalMoves': legalMoves, 'valid': 1, 'win': win }))
        if(legalMoves.length == 1){
            console.log(JSON.stringify({ 'board': state_, 'legalMoves': legalMoves, 'valid': 1, 'win': 0 }))
        }else{
            console.log(JSON.stringify({ 'board': state_, 'legalMoves': legalMoves, 'valid': 1, 'win': win }))
        }
    } catch (error) {
        console.error("Error en la simulación del movimiento:", error);
    }

    // Renderizar el estado de manera simple (sin HTML)
    //renderstate(state); // Llama a la versión modificada de renderstate
} else {
    var win = 0
    if (findterminalp(state, library)) {
        win = 1
    }
    //console.log('El movimiento no es válido:', move);
    if(legalMoves.length == 0){
        console.log(JSON.stringify({ 'board': state, 'legalMoves': legalMoves, 'valid': 0, 'win': 0 }))
    }else{
        console.log(JSON.stringify({ 'board': state, 'legalMoves': legalMoves, 'valid': 0, 'win': win }))
    }
}


process.exit(1);