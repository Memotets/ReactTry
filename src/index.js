import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//random set of Start player
function setFirst() {
    return Math.random() > 0.5 ? "X" : "O";
}
//usual funtion of Toggle player
function togglePlayer(player) {
    return player === "X" ? "O" : "X";
}
//Inicial Values of the game
const InitialValue = setFirst();
let valueOnState = InitialValue;

//Square funtion component as it is on tutorial
function Square(props) {
    return (
        <button
            className="square"
            onClick={
                props.onClick
            }>
            {props.value}
        </button>
    );
}

//board component as it is on tutorial
class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

//Game component with changes about random start player
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: valueOnState === "X" ? true : false, // deside who is next acording to random start player
            stepsNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0,
            this.state.stepsNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = valueOnState; //set move of player
        valueOnState = togglePlayer(valueOnState); //toggle player
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepsNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    //check who is next player acording to step
    checkNextPlayer(step) {
        return (InitialValue === "X") ? (step % 2) === 0 : (step % 2) !== 0
    }

    jumpTo(step) {
        if (this.checkNextPlayer(step)) valueOnState = "X"; //set next player acording to step
        else valueOnState = "O";
        this.setState({
            stepsNumber: step,
            xIsNext: this.checkNextPlayer(step) //set next player acording to step
        });

    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepsNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + valueOnState;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;

}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
