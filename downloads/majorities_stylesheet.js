//------------------------------------------------------------------------------
// Majorities
//------------------------------------------------------------------------------

function renderstate (state)
 {var role = compfindx('R',seq('control','R'),state,library);
  var redrows = compfindx('N',seq('num_letter_lines','red','N'),state,library);
  var redcols = compfindx('N',seq('num_number_lines','red','N'),state,library);
  var redvert = compfindx('N',seq('num_vertical_lines','red','N'),state,library);
  var bluerows = compfindx('N',seq('num_letter_lines','blue','N'),state,library);
  var bluecols = compfindx('N',seq('num_number_lines','blue','N'),state,library);
  var bluevert = compfindx('N',seq('num_vertical_lines','blue','N'),state,library);
  var table = document.createElement('table');
  table.setAttribute('border','0');
  row = table.insertRow(0);
  var cell = row.insertCell(0);
  cell.innerHTML = "Rows: " + redrows + "<br/>Columns: " + redcols + "<br/>Verticals: " + redvert;
  cell = row.insertCell(1);
  var board = renderboard(state);
  cell.appendChild(board);
  cell = row.insertCell(2);
  cell.innerHTML = "Rows: " + bluerows + "<br/>Columns: " + bluecols + "<br/>Verticals: " + bluevert;
  row = table.insertRow(1);
  var cell = row.insertCell(0);
  cell.setAttribute('colspan',3);
  cell.setAttribute('align','center');
  cell.setAttribute('style','font-size:20px');
  if (compfindp('terminal',state,library))
     {cell.innerHTML = 'Game over'}
     else {cell.innerHTML = 'Control:  ' + role};
  return table}

function renderboard (state)
 {var canvas = document.createElement('canvas');
  canvas.setAttribute('width','340px');
  canvas.setAttribute('height','441px');

  drawhex(140, 40,canvas);

  drawhex(110, 60,canvas);
  drawhex(170, 60,canvas);

  drawhex(80, 80,canvas);
  drawblack(140, 80,canvas);
  drawhex(200, 80,canvas);

  drawhex(50,100,canvas);
  drawhex(110,100,canvas);
  drawhex(170,100,canvas);
  drawhex(230,100,canvas);

  drawhex(20,120,canvas);
  drawhex(80,120,canvas);
  drawhex(140,120,canvas);
  drawhex(200,120,canvas);
  drawhex(260,120,canvas);

  drawhex(50,140,canvas);
  drawhex(110,140,canvas);
  drawhex(170,140,canvas);
  drawhex(230,140,canvas);

  drawhex(20,160,canvas);
  drawhex(80,160,canvas);
  drawblack(140,160,canvas);
  drawhex(200,160,canvas);
  drawhex(260,160,canvas);

  drawhex(50,180,canvas);
  drawhex(110,180,canvas);
  drawhex(170,180,canvas);
  drawhex(230,180,canvas);

  drawhex(20,200,canvas);
  drawhex(80,200,canvas);
  drawhex(140,200,canvas);
  drawhex(200,200,canvas);
  drawhex(260,200,canvas);

  drawhex(50,220,canvas);
  drawblack(110,220,canvas);
  drawblack(170,220,canvas);
  drawhex(230,220,canvas);

  drawhex(20,240,canvas);
  drawhex(80,240,canvas);
  drawhex(140,240,canvas);
  drawhex(200,240,canvas);
  drawhex(260,240,canvas);

  drawblack(50,260,canvas);
  drawhex(110,260,canvas);
  drawhex(170,260,canvas);
  drawblack(230,260,canvas);

  drawhex(20,280,canvas);
  drawhex(80,280,canvas);
  drawhex(140,280,canvas);
  drawhex(200,280,canvas);
  drawhex(260,280,canvas);

  drawhex(50,300,canvas);
  drawhex(110,300,canvas);
  drawhex(170,300,canvas);
  drawhex(230,300,canvas);

  drawhex(80,320,canvas);
  drawhex(140,320,canvas);
  drawhex(200,320,canvas);

  drawhex(110,340,canvas);
  drawhex(170,340,canvas);

  drawhex(140,360,canvas);

  for (var i=0; i<state.length; i++)
      {if (state[i][0]=='cell')
          {var x = xpos(state[i][1],state[i][2]);
           var y = ypos(state[i][1],state[i][2]);
           if (state[i][3]=='red') {drawred(x,y,canvas)};
           if (state[i][3]=='blue') {drawblue(x,y,canvas)}}};

  return canvas}

function xpos (m,n)
 {return xm(m)+xn(n)-100}

function ypos (m,n)
 {return 200+ym(m)-yn(n)}

function xm (m)
 {if (m=='a') {return 0};
  if (m=='b') {return 30};
  if (m=='c') {return 60};
  if (m=='d') {return 90};
  if (m=='e') {return 120};
  if (m=='f') {return 150};
  if (m=='g') {return 180};
  if (m=='h') {return 210};
  if (m=='i') {return 240};
  return 330}

function ym (m)
 {if (m=='a') {return 0};
  if (m=='b') {return 20};
  if (m=='c') {return 40};
  if (m=='d') {return 60};
  if (m=='e') {return 80};
  if (m=='f') {return 100};
  if (m=='g') {return 120};
  if (m=='h') {return 140};
  if (m=='i') {return 160};
  return 330}

function yn (n)
 {if (n=='1') {return 0};
  if (n=='2') {return 20};
  if (n=='3') {return 40};
  if (n=='4') {return 60};
  if (n=='5') {return 80};
  if (n=='6') {return 100};
  if (n=='7') {return 120};
  if (n=='8') {return 140};
  if (n=='9') {return 160};
  return 330}

function xn (n)
 {if (n=='1') {return 0};
  if (n=='2') {return 30};
  if (n=='3') {return 60};
  if (n=='4') {return 90};
  if (n=='5') {return 120};
  if (n=='6') {return 150};
  if (n=='7') {return 180};
  if (n=='8') {return 210};
  if (n=='9') {return 240};
  return 330}

//------------------------------------------------------------------------------
// Drawing subroutines
//------------------------------------------------------------------------------

// function drawhex (x,y,w)
//  {var ctx = w.getContext('2d');
//   ctx.beginPath();
//   ctx.lineWidth=1;
//   ctx.moveTo(x+10,y+ 0);
//   ctx.lineTo(x+30,y+ 0);
//   ctx.lineTo(x+40,y+20);
//   ctx.lineTo(x+30,y+40);
//   ctx.lineTo(x+10,y+40);
//   ctx.lineTo( x+0,y+20);
//   ctx.closePath();
//   ctx.fillStyle = "#fff0f0";
//   ctx.fill();
//   ctx.stroke()}
//
// function drawhex (x,y,w)
//  {var ctx = w.getContext('2d');
//   ctx.beginPath();
//   ctx.lineWidth=1;
//   ctx.moveTo(x+10,y+ 0);
//   ctx.lineTo(x+30,y+ 0);
//   ctx.lineTo(x+40,y+20);
//   ctx.lineTo(x+30,y+40);
//   ctx.lineTo(x+10,y+40);
//   ctx.lineTo( x+0,y+20);
//   ctx.closePath();
//   ctx.fillStyle = "#dddddd";
//   ctx.fill();
//   ctx.stroke()}

function drawhex (x,y,canvas)
 {drawline(x+ 0,y+20,x+10,y+ 0,canvas);
  drawline(x+10,y+ 0,x+30,y+ 0,canvas);
  drawline(x+30,y+ 0,x+40,y+20,canvas);
  drawline(x+40,y+20,x+30,y+40,canvas);
  drawline(x+30,y+40,x+10,y+40,canvas);
  drawline(x+10,y+40, x+0,y+20,canvas)}

function drawred (x,y,w)
 {var ctx = w.getContext('2d');
  ctx.beginPath();
  ctx.lineWidth=2;
  ctx.arc(x+20,y+20,12,0,2*Math.PI,false);
  ctx.stroke();
  ctx.fillStyle = "#ff8888";
  ctx.fill();}

function drawblue (x,y,w)
 {var ctx = w.getContext('2d');
  ctx.beginPath();
  ctx.lineWidth=2;
  ctx.arc(x+20,y+20,12,0,2*Math.PI,false);
  ctx.stroke();
  ctx.fillStyle = "#8888ff";
  ctx.fill();}
  
 function drawblack (x,y,w)
  {var ctx = w.getContext('2d');
   ctx.beginPath();
   ctx.lineWidth=2;
   ctx.arc(x+20,y+20,12,0,2*Math.PI,false);
   ctx.stroke();
   ctx.fillStyle = "#000000";
   ctx.fill();}

function drawblank (x,y,w)
 {var ctx = w.getContext('2d');
  ctx.beginPath();
  ctx.lineWidth=2;
  ctx.arc(x+20,y+20,12,0,2*Math.PI,false);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fill();}

function drawline(u,v,x,y,w)
 {var ctx = w.getContext('2d');
  ctx.beginPath();
  ctx.lineWidth=1;
  ctx.moveTo(u,v);
  ctx.lineTo(x,y);
  ctx.stroke()}

function drawnode (node,x,y,canvas)
 {var mark = compfindx('X',seq('cell',node,'X'),state,library);
  if (mark=='red') {drawred(x,y,canvas); return true};
  if (mark=='black') {drawblack(x,y,canvas); return true};
  drawblank(x,y,canvas);
  return true}

function drawtext (text,x,y,w)
 {var ctx = w.getContext('2d');
  ctx.fillStyle = "#000000";
  ctx.font="italic 14px Times"
  ctx.fillText(text,x+12,y+18);
  return true}

function drawscore (text,x,y,w)
 {var ctx = w.getContext('2d');
  ctx.fillStyle = "#000000";
  ctx.font="28px Times"
  ctx.fillText(text,x+12,y+18);
  return true}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
