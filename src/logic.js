export const SIZE = 5;
export const STORAGE_KEY = 'daily-games:islas-de-tinta:v1';
export function runs(line) {
  const result = []; let n = 0;
  for (const cell of [...line, 0]) { if (cell === 1) n++; else if (n) { result.push(n); n = 0; } }
  return result.length ? result : [0];
}
export function clues(board) {
  return { rows: Array.from({length:5}, (_,r)=>runs(board.slice(r*5,r*5+5))), cols: Array.from({length:5},(_,c)=>runs(Array.from({length:5},(_,r)=>board[r*5+c]))) };
}
const patterns = [
  ['00100','01110','11111','01110','00100'],
  ['10001','11011','11111','01110','00100'],
  ['00100','01110','00111','11111','01110'],
  ['01110','11011','10001','11011','01110'],
  ['11110','10000','11100','10000','11111'],
  ['11111','10101','00100','00100','01110']
];
export const PUZZLES = patterns.map((rows,i)=> {
 const solution = rows.join('').split('').map(Number);
 return {id:i, name:['La semilla','El abrazo','La vela','El arrecife','La marea','La fuente'][i], subtitle:['Una pequeña idea toma forma.','Dos orillas que se encuentran.','El viento deja una pista.','Un refugio entre las olas.','Líneas que vuelven a la orilla.','Un pequeño manantial de ideas.'][i], solution, ...clues(solution)};
});
export function solve(rowClues, colClues, limit = 2) {
 const options = rowClues.map(c=>Array.from({length:32},(_,n)=>Array.from({length:5},(_,i)=>(n>>i)&1)).filter(a=>JSON.stringify(runs(a))===JSON.stringify(c)));
 const columnOptions = colClues.map(c=>Array.from({length:32},(_,n)=>Array.from({length:5},(_,i)=>(n>>i)&1)).filter(a=>JSON.stringify(runs(a))===JSON.stringify(c)));
 const answers = [];
 function visit(rows) { if(answers.length>=limit) return; const depth=rows.length;
   if(depth===5) {answers.push(rows.flat()); return;}
   for(const row of options[depth]) { const next=[...rows,row]; if(columnOptions.every((opts,c)=>opts.some(opt=>next.every((r,i)=>r[c]===opt[i])))) visit(next); }
 } visit([]); return answers;
}
export function solved(board, puzzle) { return board.every((cell,i)=>(cell===1) === (puzzle.solution[i]===1)); }
export function toggle(board,index,mode) { if(!Number.isInteger(index)||index<0||index>=25||![1,2].includes(mode)) return [...board]; const next=[...board]; next[index] = next[index] === mode ? 0 : mode; return next; }
export function emptyState() { return {version:1, updatedAt:null, currentLevel:0, completed:{}, run:{boards:PUZZLES.map(()=>Array(25).fill(0)), moves:Array(6).fill(0)}}; }
export function parseState(raw) {
 try { const x=JSON.parse(raw); if(!x||x.version!==1||!Number.isInteger(x.currentLevel)||x.currentLevel<0||x.currentLevel>5||!(x.updatedAt===null || (typeof x.updatedAt==='string'&&Number.isFinite(Date.parse(x.updatedAt))))||!x.completed||typeof x.completed!=='object'||Array.isArray(x.completed)) return null;
 const clean=emptyState(); clean.currentLevel=x.currentLevel; clean.updatedAt=x.updatedAt;
 for(const [k,v] of Object.entries(x.completed)) if(/^[0-5]$/.test(k)&&Number.isInteger(v?.bestMoves)&&v.bestMoves>0&&v.bestMoves<100000) clean.completed[k]={bestMoves:v.bestMoves};
 if(x.run!=null) { const {boards,moves}=x.run; if(!Array.isArray(boards)||boards.length!==6||!boards.every(b=>Array.isArray(b)&&b.length===25&&b.every(v=>[0,1,2].includes(v)))||!Array.isArray(moves)||moves.length!==6||!moves.every(v=>Number.isInteger(v)&&v>=0&&v<100000)) return null; clean.run={boards:boards.map(b=>[...b]),moves:[...moves]}; }
 return clean; } catch{return null;}
}
