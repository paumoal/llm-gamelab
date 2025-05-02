//------------------------------------------------------------------------------
// badqueens
//------------------------------------------------------------------------------

function renderstate (state)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','2');
  table.setAttribute('bgcolor','#cccccc');
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
var div = document.createElement('div');
div.style.fontSize = 24;
div.append(table);
div.append( compfindx('Z',seq('step','Z'),state,seq()) );

  return div}

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
 {var image = compfindp(seq('filled',file,rank),state,library);
  if (compfindp(seq('filled',file,rank),state,library))
     {return '../library/badqueens/Black_Queen.png'};
  return false}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------