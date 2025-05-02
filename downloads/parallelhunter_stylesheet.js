//==============================================================================
// parallelhunter
//==============================================================================

function renderstate (state)
 {var step = compfindx('N',seq('step','N'),state,library);
  var role = compfindx('R',seq('control','R'),state,library);
  var table = document.createElement('table');
  table.setAttribute('border','0');
  var row = table.insertRow(0);
  var cell = row.insertCell(0);
  cell.setAttribute('align','center');
  cell.setAttribute('style','font-size:20px');
  cell.innerHTML = 'Step:  ' + step;
  row = table.insertRow(1);
  var cell = row.insertCell(0);
  var board = renderboard(state);
  cell.appendChild(board);
  row = table.insertRow(2);
  var cell = row.insertCell(0);
  cell.setAttribute('align','center');
  cell.setAttribute('style','font-size:20px');
  if (compfindp('terminal',state,library))
     {cell.innerHTML = 'Game over'}
     else {cell.innerHTML = 'Control:  ' + role};
  return table}

function renderboard (state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('border','0');
  var row = table.insertRow(0);
  var cell = row.insertCell(0);
  cell.appendChild(maketable('left',state));
  cell = row.insertCell(1);
  cell.appendChild(maketable('right',state));
  return table}

function maketable (board,state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('bgcolor','white');
  table.setAttribute('border','10');
  makerow(table,board,0,state);
  makerow(table,board,1,state);
  makerow(table,board,2,state);
  makerow(table,board,3,state);
  makerow(table,board,4,state);
  return table}

function makerow (table,board,rownum,state)
 {var row =table.insertRow(rownum);
  makecell(row,board,rownum,0,state);
  makecell(row,board,rownum,1,state);
  makecell(row,board,rownum,2,state);
  return row}

function makecell (row,board,rownum,colnum,state)
 {var cell = row.insertCell(colnum);
  cell.setAttribute('width','40');
  cell.setAttribute('height','40');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  rownum = (rownum+1).toString();
  colnum = (colnum+1).toString();
  var mark = compfindx('Z',seq('cell',board,rownum,colnum,'Z'),state,seq());
  if (mark=='knight') {cell.innerHTML = 'K'};
  if (mark=='pawn') {cell.innerHTML = 'p'};
  if (mark=='blank') {cell.innerHTML = '&nbsp;'};
  return cell}


//==============================================================================
//==============================================================================
//==============================================================================
