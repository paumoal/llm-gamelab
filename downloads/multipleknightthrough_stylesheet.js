//------------------------------------------------------------------------------
// multipleknightthrough
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
  table.setAttribute('width','200');
  table.setAttribute('cellspacing','2');
  table.setAttribute('bgcolor','#cccccc');
  table.setAttribute('border','4');
  for (var i=8; i>0; i--)
      {var row = table.insertRow(8-i);
       var rank = stringize(i);
       makecell(row,game,'a',rank,state);
       makecell(row,game,'b',rank,state);
       makecell(row,game,'c',rank,state);
       makecell(row,game,'d',rank,state)};
  return table}

function makecell (row,game,file,rank,state)
 {var cell = row.insertCell(row.cells.length);
  cell.setAttribute('width','40');
  cell.setAttribute('height','40');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  var image = getimage(game,file,rank,state);
  if (image)
     {var widget = document.createElement('img');
      widget.setAttribute('width','36');
      widget.setAttribute('height','36');
      widget.setAttribute('src',image);
      cell.appendChild(widget)}
     else {cell.innerHTML = '&nbsp;'};
  return cell}

function getimage (game,file,rank,state)
 {var image = compfindx('Piece',seq('cell',game,file,rank,'Piece'),state,library);
  if (image=='white')
     {return '../library/knightthrough/white.png'};
  if (image=='black')
     {return '../library/knightthrough/black.png'};
  return ''}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
