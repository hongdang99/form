import React, { Component } from "react";
import "./App.css";
import Board from "./component/Board";

const row = 9;
const col = 16;
const amount = 36;
var lines = [];
var newSquare = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      square: this.generateBoard(),
      square1: null,
      square2: null,
      score: 0,
      mix_times: 5,
    };
    this.hasLine = false;
    // this.doneLine = true;
  }

  generateBoard() {
    let arr = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [
        0,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "7",
        "6",
        "5",
        "4",
        "4",
        "2",
        "1",
        0,
      ],
      [
        0,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "6",
        "6",
        "6",
        "5",
        "4",
        "4",
        "2",
        "1",
        0,
      ],
      [
        0,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1",
        0,
      ],
      [
        0,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1",
        0,
      ],
      [
        0,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1",
        0,
      ],
      [
        0,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "7",
        "6",
        "6",
        "4",
        "3",
        "2",
        "1",
        0,
      ],
      [
        0,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1",
        0,
      ],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    return arr;
  }

  componentDidUpdate() {
    if (this.hasLine) {
      lines.map((line) => {
        return (newSquare[line.x][line.y] = 0);
      });
      newSquare[this.state.square1.x][this.state.square1.y] = newSquare[
        this.state.square2.x
      ][this.state.square2.y] = 0;

      setTimeout(() => {
        this.setState({
          square: newSquare,
          square1: null,
          square2: null,
        });
      }, 1000);
      this.hasLine = false;
      lines = [];
      return;
    }

    if (this.state.square1 && this.state.square2) {
      newSquare = this.state.square.slice();
      if (!this.isPair(this.state.square1, this.state.square2)) {
        lines = [];
        this.setState({
          square1: null,
          square2: null,
        });
      } else {
        if (lines.length > 0) {
          lines.map((line) => {
            return (newSquare[line.x][line.y] = line.value);
          });
        }

        this.setState({
          square: newSquare,
          score: this.state.score + 10,
        });

        this.hasLine = true;
      }
    }

    console.log(this.state.square1);
    console.log(this.state.square2);
  }

  handleClick = (i, j) => {
    if (!this.state.square1) {
      this.setState({
        square1: { x: i, y: j },
        valueSquare1: this.state.square[i][j],
      });
      return;
    }

    if (!this.state.square2) {
      this.setState({
        square2: { x: i, y: j },
        valueSquare2: this.state.square[i][j],
      });
    }
  };

  //-------------------------------------Checker---------------------------------------------------------------
  // In the same row
  checkLineX = (y1, y2, x) => {
    const yleft = Math.min(y1, y2);
    const yright = Math.max(y1, y2);
    const tmp = [];

    for (let yi = yleft + 1; yi < yright; yi++) {
      if (this.state.square[x][yi] !== 0) {
        return false;
      }

      tmp.push({ x: x, y: yi, value: "horizonal" });
    }

    lines.push(...tmp);
    return true;
  };
  // In the same collum
  checkLineY = (x1, x2, y) => {
    const xup = Math.min(x1, x2);
    const xdown = Math.max(x1, x2);
    const tmp = [];

    for (let xi = xup + 1; xi < xdown; xi++) {
      if (this.state.square[xi][y] !== 0) {
        return false;
      }
      tmp.push({ x: xi, y: y, value: "vertical" });
    }

    lines.push(...tmp);
    return true;
  };
  // In a rectangle size and horizonal way
  checkRectX = (p1, p2) => {
    let pleft = p1;
    let pright = p2;

    if (p1.y > p2.y) {
      pleft = p2;
      pright = p1;
    }

    lines = [];
    for (let yi = pleft.y; yi < pright.y; yi++) {
      if (
        this.checkLineX(pleft.y, yi, pleft.x) &&
        this.checkLineY(pleft.x, pright.x, yi) &&
        this.checkLineX(yi, pright.y, pright.x) &&
        this.state.square[pleft.x][yi] === 0 &&
        this.state.square[pright.x][yi] === 0
      ) {
        if (pleft.x > pright.x) {
          lines.push(
            { x: pleft.x, y: yi, value: "top_left" },
            { x: pright.x, y: yi, value: "bottom_right" }
          );
        } else {
          lines.push(
            { x: pleft.x, y: yi, value: "bottom_left" },
            { x: pright.x, y: yi, value: "top_right" }
          );
        }

        return true;
      }
    }

    return false;
  };
  // In a rectangle size and vertical way
  checkRectY = (p1, p2) => {
    let pAbove = p1;
    let pBottom = p2;

    if (p1.x > p2.x) {
      pAbove = p2;
      pBottom = p1;
    }

    lines = [];

    for (let xi = pAbove.x + 1; xi <= pBottom.x; xi++) {
      if (
        this.checkLineY(pAbove.x, xi, pAbove.y) &&
        this.checkLineX(pAbove.y, pBottom.y, xi) &&
        this.checkLineY(xi, pBottom.x, pBottom.y) &&
        this.state.square[xi][pAbove.y] === 0 &&
        this.state.square[xi][pBottom.y] === 0
      ) {
        if (pAbove.y > pBottom.y) {
          lines.push(
            { x: xi, y: pAbove.y, value: "top_left" },
            { x: xi, y: pBottom.y, value: "bottom_right" }
          );
        } else {
          lines.push(
            { x: xi, y: pAbove.y, value: "top_right" },
            { x: xi, y: pBottom.y, value: "bottom_left" }
          );
        }
        return true;
      }
    }
    return false;
  };
  // Nearby in corner
  checkCorner(p1, p2) {
    let pLeft = p1;
    let pRight = p2;

    if (p1.y > p2.y) {
      pLeft = p2;
      pRight = p1;
    }

    let p = { x: pRight.x, y: pLeft.y };
    if (this.state.square[p.x][p.y] === 0) {
      lines = [];

      if (
        this.checkLineX(p.y, pRight.y, p.x) &&
        this.checkLineY(p.x, pLeft.x, p.y)
      ) {
        if (pLeft.x > pRight.x) {
          lines.push({ x: p.x, y: p.y, value: "bottom_right" });
        } else {
          lines.push({ x: p.x, y: p.y, value: "top_right" });
        }
        return true;
      }
    }

    lines = [];
    p = { x: pLeft.x, y: pRight.y };
    if (this.state.square[p.x][p.y] !== 0) return false;
    debugger;
    if (
      this.checkLineX(p.y, pLeft.y, p.x) &&
      this.checkLineY(p.x, pRight.x, p.y)
    ) {
      if (pLeft.x > pRight.x) {
        lines.push({ x: p.x, y: p.y, value: "top_left" });
      } else {
        lines.push({ x: p.x, y: p.y, value: "bottom_left" });
      }
      return true;
    }

    return false;
  }
  // Extend or L way in a horizontalway
  checkExtendY = (p1, p2, maxY) => {
    let pup = p1;
    let pdown = p2;

    if (p1.y > p2.y) {
      pup = p2;
      pdown = p1;
    }

    //left to right
    lines = [];
    for (let yi = pup.y + 1; yi <= pdown.y; yi++) {
      lines.push({ x: pup.x, y: yi, value: "horizonal" });
    }

    for (let yi = pdown.y + 1; yi <= maxY + 1; yi++) {
      lines.push(
        { x: pup.x, y: yi, value: "horizonal" },
        { x: pdown.x, y: yi, value: "horizonal" }
      );

      if (
        this.checkLineX(pup.y, yi, pup.x) &&
        this.checkLineX(pdown.y, yi, pdown.x) &&
        this.checkLineY(pup.x, pdown.x, yi) &&
        this.state.square[pup.x][yi] === 0 &&
        this.state.square[pdown.x][yi] === 0
      ) {
        if (pup.x > pdown.x) {
          lines.push(
            { x: pup.x, y: yi, value: "top_left" },
            { x: pdown.x, y: yi, value: "bottom_left" }
          );
        } else {
          lines.push(
            { x: pup.x, y: yi, value: "bottom_left" },
            { x: pdown.x, y: yi, value: "top_left" }
          );
        }

        return true;
      }
    }

    // right to left
    lines = [];
    for (let yi = pdown.y - 1; yi >= pup.y; yi--) {
      lines.push({ x: pdown.x, y: yi, value: "horizonal" });
    }
    for (let yi = pup.y - 1; yi >= 0; yi--) {
      lines.push(
        { x: pup.x, y: yi, value: "horizonal" },
        { x: pdown.x, y: yi, value: "horizonal" }
      );

      if (
        this.checkLineX(pup.y, yi, pup.x) &&
        this.checkLineX(pdown.y, yi, pdown.x) &&
        this.checkLineY(pup.x, pdown.x, yi) &&
        this.state.square[pup.x][yi] === 0 &&
        this.state.square[pdown.x][yi] === 0
      ) {
        if (pup.x > pdown.x) {
          lines.push(
            { x: pup.x, y: yi, value: "top_right" },
            { x: pdown.x, y: yi, value: "bottom_right" }
          );
        } else {
          lines.push(
            { x: pup.x, y: yi, value: "bottom_right" },
            { x: pdown.x, y: yi, value: "top_right" }
          );
        }
        return true;
      }
    }

    return false;
  };
  // Extend or L way in a vertical way
  checkExtendX = (p1, p2, maxY) => {
    let pleft = p1;
    let pright = p2;

    if (p1.x > p2.x) {
      pleft = p2;
      pright = p1;
    }

    //up to down
    lines = [];
    for (let xi = pleft.x + 1; xi <= pright.x; xi++) {
      lines.push({ x: xi, y: pleft.y, value: "vertical" });
    }

    for (let xi = pright.x + 1; xi <= maxY; xi++) {
      lines.push(
        { x: xi, y: pleft.y, value: "vertical" },
        { x: xi, y: pright.y, value: "vertical" }
      );
      if (
        this.checkLineY(pleft.x, xi, pleft.y) &&
        this.checkLineY(pright.x, xi, pright.y) &&
        this.checkLineX(pleft.y, pright.y, xi) &&
        this.state.square[xi][pleft.y] === 0 &&
        this.state.square[xi][pright.y] === 0
      ) {
        if (pleft.y > pright.y) {
          lines.push(
            { x: xi, y: pleft.y, value: "top_left" },
            { x: xi, y: pright.y, value: "top_right" }
          );
        } else {
          lines.push(
            { x: xi, y: pleft.y, value: "top_right" },
            { x: xi, y: pright.y, value: "top_left" }
          );
        }
        return true;
      }
    }

    // down to up
    lines = [];
    for (let xi = pright.x - 1; xi >= pleft.x; xi--) {
      lines.push({ x: xi, y: pright.y, value: "vertical" });
    }
    for (let xi = pleft.x - 1; xi >= 0; xi--) {
      lines.push(
        { x: xi, y: pleft.y, value: "vertical" },
        { x: xi, y: pright.y, value: "vertical" }
      );
      if (
        this.checkLineY(pleft.x, xi, pleft.y) &&
        this.checkLineY(pright.x, xi, pright.y) &&
        this.checkLineX(pleft.y, pright.y, xi) &&
        this.state.square[xi][pleft.y] === 0 &&
        this.state.square[xi][pright.y] === 0
      ) {
        if (pleft.y > pright.y) {
          lines.push(
            { x: xi, y: pleft.y, value: "bottom_left" },
            { x: xi, y: pright.y, value: "bottom_right" }
          );
        } else {
          lines.push(
            { x: xi, y: pleft.y, value: "bottom_right" },
            { x: xi, y: pright.y, value: "bottom_left" }
          );
        }
        return true;
      }
    }

    return false;
  };

  isPair = (p1, p2) => {
    if (!p1 || !p2) {
      throw Error("p1, p2 phai co gia tri");
    }

    let x1 = p1.x;
    let y1 = p1.y;

    let x2 = p2.x;
    let y2 = p2.y;
    if (this.state.square[x1][y1] !== this.state.square[x2][y2]) {
      return false;
    }
    if (
      this.state.square1.x === this.state.square2.x &&
      this.state.square1.y === this.state.square2.y
    ) {
      return false;
    }
    if ((this.state.square[x1][y1] === this.state.square[x2][y2]) === 0) {
      return false;
    }
    if (x1 === x2 && this.checkLineX(y1, y2, x1)) {
      return true;
    }
    if (y1 === y2 && this.checkLineY(x1, x2, y1)) {
      return true;
    }
    debugger;
    if (x1 !== x2 && this.checkRectX(p1, p2)) {
      return true;
    }
    debugger;
    if (x1 !== x2 && this.checkRectY(p1, p2)) {
      return true;
    }
    debugger;
    if (this.checkCorner(p1, p2)) {
      console.log("Booop");
      return true;
    }
    debugger;
    if (this.checkExtendX(p1, p2, row)) {
      console.log("In X"); // See Log
      return true;
    }
    debugger;
    if (this.checkExtendY(p1, p2, col)) {
      console.log("In Y"); // See Log
      return true;
    }
    debugger;
    return false;
  };
  MixPokemon = () => {
    if (this.state.mix_times > 0) {
      let arr1 = this.state.square;
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          if (arr1[i][j] !== 0) {
            let newSquare = arr1.slice();
            newSquare[i][j] = Math.floor(Math.random() * amount) + 1;
            this.setState({
              square: newSquare,
              mix_times: this.state.mix_times - 1,
            });
          }
        }
      }
    }
  };
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            square={this.state.square}
            onClick={this.handleClick}
            square1={this.state.square1}
            square2={this.state.square2}
          />
        </div>
        <div> Score: {this.state.score}</div>
        <hr />
        <button onClick={this.MixPokemon} id="mix_button">
          Mix
        </button>
        <p>Mix times: {this.state.mix_times}</p>
      </div>
    );
  }
}

export default App;
