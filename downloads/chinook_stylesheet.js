//------------------------------------------------------------------------------
// Chinook
//------------------------------------------------------------------------------

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
  for (var i=8; i>0; i=i-2)
      {var row = table.insertRow(8-i);
       var rank = stringize(i);
       addcell(row,'a',rank,state);
       addcell(row,'b',rank,state);
       addcell(row,'c',rank,state);
       addcell(row,'d',rank,state);
       //addcell(row,'e',rank,state);
       //addcell(row,'f',rank,state);
       //addcell(row,'g',rank,state);
       //addcell(row,'h',rank,state);
       row = table.insertRow(8-i+1);
       var rank = stringize(i-1);
       addcell(row,'a',rank,state);
       addcell(row,'b',rank,state);
       addcell(row,'c',rank,state);
       addcell(row,'d',rank,state);
       //addcell(row,'e',rank,state);
       //addcell(row,'f',rank,state);
       //addcell(row,'g',rank,state);
       //addcell(row,'h',rank,state)
};
  return table}

function addcell (row,file,rank,state)
 {var cell = row.insertCell(row.cells.length);
  cell.setAttribute('bgcolor','#cccccc');
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
  return true}

function getimage (file,rank,state)
 {var color = compfindx('Piece',seq('cell',file,rank,'Piece'),state,library);
  if (color==='red') {return '../library/chinook/red.png'};
  if (color==='blue') {return '../library/chinook/blue.png'};
  return false}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
