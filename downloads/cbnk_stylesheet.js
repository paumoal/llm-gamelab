//==============================================================================
// cbnk
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
  table.setAttribute('bgcolor','#cccccc');
  table.setAttribute('border','4');
  for (var i=8; i>0; i--)
      {var row = table.insertRow(8-i);
       var rank = stringize(i);
       makecell(row,'1',rank,state);
       makecell(row,'2',rank,state);
       makecell(row,'3',rank,state);
       makecell(row,'4',rank,state);
       makecell(row,'5',rank,state);
       makecell(row,'6',rank,state);
       makecell(row,'7',rank,state);
       makecell(row,'8',rank,state)};
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
 {var image = compfindx('Piece',seq('location',file,rank,'Piece'),state,library);
  if (image=='red') {return '../library/cbnk/red.png'};
  if (image=='black') {return '../library/cbnk/blue.png'};
  return false}

//==============================================================================
//==============================================================================
//==============================================================================
