//==============================================================================
// parallelbuttonsandlights
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

function maketable (component,state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('bgcolor','white');
  table.setAttribute('border','4');
  makerow(table,0,component,state);
  return table}

function makerow (table,rownum,component,state)
 {var row =table.insertRow(rownum);
  makecell(row,seq('p',component),state);
  makecell(row,seq('q',component),state);
  makecell(row,seq('r',component),state);
  return row}

function makecell (row,light,state)
 {var cell = row.insertCell(row.cells.length);
  cell.setAttribute('width','40');
  cell.setAttribute('height','40');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  if (compfindp(light,state,seq()))
     {cell.innerHTML = '<img src="../library/buttonsandlights/green.jpg"/>'}
     else {cell.innerHTML = '<img src="../library/buttonsandlights/red.jpg"/>'};
  return cell}

//==============================================================================
//==============================================================================
//==============================================================================
