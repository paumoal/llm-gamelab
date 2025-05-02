//==============================================================================
// buttonsandlights
//==============================================================================

function renderstate (state)
 {var step = compfindx('N',seq('step','N'),state,library);
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
     else {cell.innerHTML = '&nbsp;'};
  return table}

function renderboard (state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('bgcolor','white');
  table.setAttribute('border','4');
  makerow(table,0,state);
  return table}

function makerow (table,rownum,state)
 {var row =table.insertRow(rownum);
  makecell(row,'p',state);
  makecell(row,'q',state);
  makecell(row,'r',state);
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
