//==============================================================================
// leafymcfallface
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
  table.setAttribute('bgcolor','white');
  table.setAttribute('border','10');
  for (var i = 0; i < 7; i++)
    makerow(table,i,state);
  return table}

function makerow (table,rownum,state)
 {var row =table.insertRow(rownum);
  for (var i = 0; i < 7; i++)
    makecell(row,rownum,i,state);
  return row}

function makecell (row,rownum,colnum,state)
 {var cell = row.insertCell(colnum);
  cell.setAttribute('width','40');
  cell.setAttribute('height','40');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  cell.setAttribute('style','font-family:helvetica;font-size:18pt');
  rownum = (rownum+1).toString();
  colnum = (colnum+1).toString();
  var leaf = compfindp(seq('leaf',rownum,colnum),state,seq());
  var player = compfindx("Z", seq('isplayer',rownum,colnum,"Z"),state,seq());
  if (player) {
     cell.style.backgroundColor = player;
  } else if (leaf) {
     cell.style.backgroundColor = "green";
  }
  return cell}

//==============================================================================
//==============================================================================
//==============================================================================
