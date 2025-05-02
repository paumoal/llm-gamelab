//------------------------------------------------------------------------------
// multiplehunter
//------------------------------------------------------------------------------

function renderstate (state)
 {var role = compfindx('R',seq('control','R'),state,library);
  var table = document.createElement('table');
  table.setAttribute('border','0');
  var row = table.insertRow(0);
  var cell = row.insertCell(0);
  var board = renderboard(state);
  cell.appendChild(board);
  row = table.insertRow(1);
  var cell = row.insertCell(0);
  cell.setAttribute('align','center');
  cell.setAttribute('style','font-size:20px');
  if (compfindp('terminal',state,library))
     {cell.innerHTML = 'Game over'}
     else {cell.innerHTML = 'Control:  ' + role};
  return table}

function renderboard (state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','10');
  table.setAttribute('cellpadding','0');
  table.setAttribute('border','0');
  var row = table.insertRow(0);
  var cell = row.insertCell(0);
  cell.appendChild(rendergame('a',state));
  cell = row.insertCell(1);
  cell.appendChild(rendergame('b',state));
  cell = row.insertCell(2);
  cell.appendChild(rendergame('c',state));
  return table}

function rendergame (game,state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('bgcolor','white');
  table.setAttribute('border','10');
  makerow(table,game,1,state);
  makerow(table,game,2,state);
  makerow(table,game,3,state);
  makerow(table,game,4,state);
  makerow(table,game,5,state);
  return table}

function makerow (table,game,rownum,state)
 {var row =table.insertRow(rownum-1);
  makecell(row,game,rownum,1,state);
  makecell(row,game,rownum,2,state);
  makecell(row,game,rownum,3,state);
  return row}

function makecell (row,game,rownum,colnum,state)
 {var cell = row.insertCell(colnum-1);
  cell.setAttribute('width','40');
  cell.setAttribute('height','40');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  rownum = rownum.toString();
  colnum = colnum.toString();
  var mark = compfindx('Z',seq('cell',game,rownum,colnum,'Z'),state,seq());
  if (mark=='knight') {cell.innerHTML = 'K'};
  if (mark=='pawn') {cell.innerHTML = 'p'};
  if (mark=='blank') {cell.innerHTML = '&nbsp;'};
  return cell}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
