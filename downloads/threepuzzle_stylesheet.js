//==============================================================================
// threepuzzle
//==============================================================================

function renderstate (state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('bgcolor','white');
  table.setAttribute('border','10');
  table.setAttribute('style','font-size:24');
  makerow(table,0,state);
  makerow(table,1,state);
  return table}

function makerow (table,rownum,state)
 {var row =table.insertRow(rownum);
  makecell(row,rownum,0,state);
  makecell(row,rownum,1,state);
  return row}

function makecell (row,rownum,colnum,state)
 {var cell = row.insertCell(colnum);
  cell.setAttribute('width','40');
  cell.setAttribute('height','40');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  var mark = findmark(rownum,colnum,state)
  if (mark && mark != 'b') {cell.innerHTML = mark}
     else {cell.innerHTML = '&nbsp;'};
  return cell}

function findmark (rownum,colnum,state)
 {if (rownum===0 && colnum===0)
     {return compfindx('M',read('board(M,X,Y,Z)'),state, [])};
  if (rownum===0 && colnum===1)
     {return compfindx('M',read('board(X,M,Y,Z)'),state, [])};
  if (rownum===1 && colnum===0)
     {return compfindx('M',read('board(X,Y,M,Z)'),state, [])};
  if (rownum===1 && colnum===1)
     {return compfindx('M',read('board(X,Y,Z,M)'),state, [])}
  return false}

//==============================================================================
//==============================================================================
//==============================================================================
