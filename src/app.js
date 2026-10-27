import {PUZZLES,STORAGE_KEY,runs,solved,toggle,emptyState,parseState} from './logic.js';
export function start(document, window) {
 const $=id=>document.getElementById(id); let state=emptyState(), mode=1, focusIndex=0, history=[], pending=null;
 function load(){try{return parseState(window.localStorage.getItem(STORAGE_KEY));}catch{return null;}}
 state=load()??state;
 function save(){state.updatedAt=new Date(Math.max(Date.now(),Date.parse(state.updatedAt||0)+1||0)).toISOString();try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(state));$('save-status').textContent='Progreso guardado en este navegador.';}catch{$('save-status').textContent='No se puede guardar aquí. Tu partida sigue en esta pestaña.';}}
 function reconcile(){const other=load();if(other&&Date.parse(other.updatedAt)>Date.parse(state.updatedAt||'1970-01-01')){state=other;history=[];}}
 function button(text,fn){const b=document.createElement('button');b.textContent=text;b.addEventListener('click',fn);return b;}
 function render(restore=false){
 const p=PUZZLES[state.currentLevel], board=state.run.boards[p.id], won=solved(board,p);
 $('progress').textContent=`${Object.keys(state.completed).length} / 6`;
 $('level-label').textContent=`ISLA ${String(p.id+1).padStart(2,'0')} / 06`;
 $('puzzle-title').textContent=p.name;$('subtitle').textContent=p.subtitle;
 $('levels').replaceChildren(...PUZZLES.map(level=>{const b=button('',()=>{reconcile();state.currentLevel=level.id;history=[];focusIndex=0;save();render();$('levels').children[level.id].focus();});b.className='level';b.setAttribute('aria-current',String(level.id===p.id));b.setAttribute('aria-label',`${level.id+1}. ${level.name}${state.completed[level.id]?', completada':''}`);for(const [className,text] of [['level-number',String(level.id+1).padStart(2,'0')],['level-name',level.name],['level-check',state.completed[level.id]?'✓':'·']]){const s=document.createElement('span');s.className=className;s.textContent=text;b.append(s);}return b;}));
 $('ink').setAttribute('aria-pressed',String(mode===1));$('empty').setAttribute('aria-pressed',String(mode===2));
 const elements=[];elements.push(document.createElement('span'));
 function clue(values,isCol,index){const e=document.createElement('div');e.className=`clue ${isCol?'col':'row'}`;const line=isCol?Array.from({length:5},(_,r)=>board[r*5+index]):board.slice(index*5,index*5+5);if(JSON.stringify(runs(line))===JSON.stringify(values))e.className+=' matched';e.setAttribute('aria-label',`${isCol?'Columna':'Fila'} ${index+1}: ${values.join(', ')}`);for(const n of values){const s=document.createElement('span');s.textContent=String(n);e.append(s);}return e;}
 p.cols.forEach((c,i)=>elements.push(clue(c,true,i)));
 for(let r=0;r<5;r++){elements.push(clue(p.rows[r],false,r));for(let c=0;c<5;c++){const i=r*5+c,b=button(board[i]===2?'×':'',()=>edit(i));b.id=`cell-${i}`;b.className=`cell${board[i]===1?' ink':''}`;b.tabIndex=i===focusIndex?0:-1;b.setAttribute('aria-label',`Fila ${r+1}, columna ${c+1}: ${['sin decidir','tinta','vacío'][board[i]]}`);b.setAttribute('aria-pressed',String(board[i]===1));b.addEventListener('focus',()=>{focusIndex=i;});b.addEventListener('keydown',event=>{const moves={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]};if(moves[event.key]){event.preventDefault();const [dr,dc]=moves[event.key];focusIndex=((r+dr+5)%5)*5+(c+dc+5)%5;render(true);}else if(['t','T','x','X'].includes(event.key)){event.preventDefault();mode=event.key.toLowerCase()==='t'?1:2;render(true);}});elements.push(b);}}
 $('board').replaceChildren(...elements);$('undo').disabled=history.length===0;$('next').hidden=!won;
 $('next').textContent=Object.keys(state.completed).length===6?'Volver a la primera →':'Siguiente isla →';
 $('status').textContent=won?(Object.keys(state.completed).length===6?'¡Archipiélago completo! Seis pequeñas ideas, un mar de tinta.':'¡Isla descubierta! El dibujo es tuyo. Puedes seguir explorando.'):'Los números cuentan grupos de tinta. Deja un hueco entre grupos.';
 if(restore)$(`cell-${focusIndex}`).focus();
 }
 function edit(i){reconcile();const p=PUZZLES[state.currentLevel];history.push([...state.run.boards[p.id]]);if(history.length>100)history.shift();state.run.boards[p.id]=toggle(state.run.boards[p.id],i,mode);state.run.moves[p.id]=Math.min(99999,state.run.moves[p.id]+1);focusIndex=i;if(solved(state.run.boards[p.id],p)){const n=Math.max(1,state.run.moves[p.id]);state.completed[p.id]={bestMoves:Math.min(state.completed[p.id]?.bestMoves??99999,n)};}save();render(true);}
 $('ink').addEventListener('click',()=>{mode=1;render();});$('empty').addEventListener('click',()=>{mode=2;render();});
 $('undo').addEventListener('click',()=>{reconcile();if(!history.length){render();return;}state.run.boards[state.currentLevel]=history.pop();save();render();});
 $('next').addEventListener('click',()=>{reconcile();state.currentLevel=Object.keys(state.completed).length===6?0:(state.currentLevel+1)%6;history=[];focusIndex=0;save();render();});
 $('help').addEventListener('click',()=>{const hidden=!$('instructions').hidden;$('instructions').hidden=hidden;$('help').setAttribute('aria-expanded',String(!hidden));});
 function confirm(kind){pending=kind;$('confirm-title').textContent=kind==='all'?'¿Borrar todo el progreso?':'¿Reiniciar esta isla?';$('confirm-description').textContent=kind==='all'?'Se borrarán las seis cuadrículas y sus logros en este navegador. No se puede deshacer.':'Se vaciará esta cuadrícula. Si ya descubriste la isla, conservarás su logro.';$('confirm-dialog').showModal();$('cancel').focus();}
 $('reset').addEventListener('click',()=>confirm('island'));$('clear').addEventListener('click',()=>confirm('all'));
 $('cancel').addEventListener('click',()=>{pending=null;$('confirm-dialog').close();});
 $('confirm-dialog').addEventListener('cancel',()=>{pending=null;});
 $('confirm').addEventListener('click',()=>{if(!pending)return;reconcile();if(pending==='all'){const stamp=state.updatedAt;state=emptyState();state.updatedAt=stamp;}else{state.run.boards[state.currentLevel]=Array(25).fill(0);state.run.moves[state.currentLevel]=0;}pending=null;history=[];save();$('confirm-dialog').close();render();});
 window.addEventListener('storage',event=>{if(event.key!==STORAGE_KEY&&event.key!==null)return;const other=event.newValue===null?emptyState():parseState(event.newValue);if(!other)return;if(other.updatedAt&&state.updatedAt&&Date.parse(other.updatedAt)<Date.parse(state.updatedAt))return;state=other;history=[];pending=null;$('confirm-dialog').close();render();$('status').textContent='Progreso actualizado desde otra pestaña.';});
 try{window.localStorage.getItem(STORAGE_KEY);}catch{$('save-status').textContent='Almacenamiento no disponible: esta partida solo vive en esta pestaña.';}
 render();return {getState:()=>structuredClone(state)};
}
if(typeof document!=='undefined')start(document,window);
