// useStateの読み込み
import { useState } from "react";


// Square 関数の定義（）
function Square({ value,onSquareClick }) {
  // 返り値の設定
  return (
    <button
      className="square"
      // クリックされたら、`onSquareClick`を呼び出す
      // ボタンの中には`value`が入っている
      onClick={onSquareClick}
    >
      {value} 
    </button>
  );
}


// ボード関数の定義
function Board({xIsNext, squares, onPlay }) {
    // handleClickの定義
    function handleClick(i) {
      // 選択したボタンが埋まっていたり、勝者がいる場合、何もせずに終わらせる
      if (squares[i] || calculateWinner(squares)) {
        return;
      }
      // nextSquaresという名前の、squaresの複製を作成
      const nextSquares = squares.slice();
      // もしもx IsNextがtrueならば、X,falseならばO
      if(xIsNext){
        nextSquares[i] = `X`;
      }else {
        nextSquares[i] = `O`;
      }
      // onPlay=handleplay ,nextSquaresという引数でhandleplayが実行される
      onPlay(nextSquares);
  }
  
  // winnerに、勝敗の結果を渡している（null,X,O）
  const winner = calculateWinner(squares);
  // statusを宣言している。（letなので再代入可能）
  let status;

  // 勝者がいるときと、いない時のstatusを決めている
  if (winner) {
    status = "Winner:" + winner;
  } else {
    // xIsNextがtrueならX、falseならばO
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // stasusの表示、Squareを正方形に配置を行っている。
  // Squareに対して、handleClickを渡している。（無限ループ対策でアローを使っている）
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

// 親コンポーネントを定義している。
// この関数がbuildした時にindex.htmlに渡されるものになる
export default function Game() {
  // historyをuseStateで定義している。配列の中に配列を作成しているため、二次元配列
  // [
  //   [null, null, null, null, null, null, null, null, null]
  // ]
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // currentMoveを useStateを利用して定義している。
  // この値は、今の動作が何番目なのかを表している。
  const [currentMove,setCurrentMove] = useState(0);
  // xIsNextを定義している。currentMoveが2で割り切れたらtrue,ダメならfalse
  // これは、Xが偶数番、Oが奇数番であるためこのようにできる
  const xIsNext = currentMove % 2 === 0;
  // currentSquaresを定義している。historyのcurrentMoveの番号の配列を渡している
  // 現在の配列をここで定義するため、常に一次元
  const currentSquares = history[currentMove];


  // 
  function handlePlay(nextSquares) {
    // nextHistoryを定義している
    // ここで、次の配列を複製しつつ、次の状態を追加している（nectSquaresを連結！）
    const nextHistory = [...history.slice(0,currentMove + 1),nextSquares];
    // 次のhistoryに更新
    setHistory(nextHistory)
    //　現在のターン数に更新 
    setCurrentMove(nextHistory.length - 1)
  }

  // 指定したターンに戻るための関数
  // useStateによってサイレンダリングしてマスを更新する。
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // historyを参照し、history内の配列のindexをmoveで取得している
  const moves = history.map((squares,move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    }else {
    description = 'Go to game start';
    }
    // ここでは、keyという重要な項目を扱っている。
    // reactは、サイレンダリングが行われた時に、変更のあった部分だけを更新するようになっている。
    // その時に、keyを指定しておけば最小限で済ませることができる
    // ただ、indexをkeyにするのは非推奨らしい。
    return (
      <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // 土台のページを作成している。
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


// 勝者がいるかの判定を行う。いる場合、勝者が返り値として帰る。
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i=0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}