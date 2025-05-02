//==============================================================================
// simpleswitches
//==============================================================================

function renderstate (state)
 {var role = compfindx('R',seq('control','R'),state,library);
  var table = document.createElement('table');
  table.setAttribute('border','0');
  var row = table.insertRow(table.rows.length);
  var cell = row.insertCell(0);
  var board = renderboard(state);
  cell.appendChild(board);
  row = table.insertRow(table.rows.length);
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
  table.setAttribute('bgcolor','#f4f6f8');
  table.setAttribute('border','4');
  for (var i=0; i<9; i++) {makerow(table,i,state)};
  return table}

function makerow (table,rownum,state)
 {var row =table.insertRow(rownum);
  for (var j=0; j<9; j++) {makecell(row,rownum,j,state)};
  return row}

function makecell (row,rownum,colnum,state)
 {var cell = row.insertCell(row.cells.length);
  cell.setAttribute('width','40');
  cell.setAttribute('height','40');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  if (compfindp(seq('on',(rownum+1).toString(),(colnum+1).toString()),state,seq()))
     {cell.innerHTML = '<img src="../library/simpleswitches/green.jpg"/>'}
     else {cell.innerHTML = '<img src="../library/simpleswitches/red.jpg"/>'};
  return cell}

//==============================================================================
//==============================================================================
//==============================================================================
