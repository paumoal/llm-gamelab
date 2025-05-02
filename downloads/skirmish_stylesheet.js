//==============================================================================
// skirmish
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
  table.setAttribute('cellspacing','2');
  table.setAttribute('border','4');
  for (var i=8; i>0; i--)
      {var row = table.insertRow(8-i);
       var rank = stringize(i);
       makecell(row,'a',rank,state);
       makecell(row,'b',rank,state);
       makecell(row,'c',rank,state);
       makecell(row,'d',rank,state);
       makecell(row,'e',rank,state);
       makecell(row,'f',rank,state);
       makecell(row,'g',rank,state);
       makecell(row,'h',rank,state)};
  return table}

function makecell (row,file,rank,state)
 {var cell = row.insertCell(row.cells.length);
  cell.setAttribute('width','50');
  cell.setAttribute('height','50');
  cell.setAttribute('align','center');
  cell.setAttribute('valign','center');
  var image = getimage(file,rank,state);
  if (image)
     {var widget = document.createElement('img');
      widget.setAttribute('width','40');
      widget.setAttribute('height','40');
      widget.setAttribute('src',image);
      cell.appendChild(widget)}
     else {cell.innerHTML = '&nbsp;'};
  return cell}

function getimage (file,rank,state)
 {var piece = compfindx('Piece',seq('location',seq('cell',file,rank),'Piece'),state,library);
  if (piece[1]==='white')
     {if (piece[2]==='king') {return '../library/skirmish/White_King.png'};
      if (piece[2]==='queen') {return '../library/skirmish/White_Queen.png'};
      if (piece[2]==='bishop') {return '../library/skirmish/White_Bishop.png'};
      if (piece[2]==='knight') {return '../library/skirmish/White_Knight.png'};
      if (piece[2]==='rook') {return '../library/skirmish/White_Rook.png'};
      if (piece[2]==='pawn') {return '../library/skirmish/White_Pawn.png'};
      return false};
  if (piece[1]==='black')
     {if (piece[2]==='king') {return '../library/skirmish/Black_King.png'};
      if (piece[2]==='queen') {return '../library/skirmish/Black_Queen.png'};
      if (piece[2]==='bishop') {return '../library/skirmish/Black_Bishop.png'};
      if (piece[2]==='knight') {return '../library/skirmish/Black_Knight.png'};
      if (piece[2]==='rook') {return '../library/skirmish/Black_Rook.png'};
      if (piece[2]==='pawn') {return '../library/skirmish/Black_Pawn.png'};
      return false};
  return false}

//==============================================================================
//==============================================================================
//==============================================================================
