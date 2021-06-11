import React, { Component } from 'react';
import './App.css';
import vertical from './images/pokemon_vertical.png';
import Board from "./component/Board";

const row = 9;
const col = 16;
const amount = 36;
var lines = [];
var newSquare = [];

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      square: this.generateBoard(),
      square1: null,
      square2: null,
      score: 0,
      // mix_times: 5
    }
    this.hasLine = false;
    // this.doneLine = true;
  }

  generateBoard(){
    let arr = [
      ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],
      ["0","1","2","3","4","5","6","7","7","6","5","4","3","2","1","0"],
      ["0","1","2","3","4","5","6","7","7","6","5","4","3","2","1","0"],
      ["0","1","2","3","4","5","6","7","7","6","5","4","3","2","1","0"],
      ["0","1","2","3","4","5","6","7","7","6","5","4","3","2","1","0"],
      ["0","1","2","3","4","5","6","7","7","6","5","4","3","2","1","0"],
      ["0","1","2","3","4","5","6","7","7","6","5","4","3","2","1","0"],
      ["0","1","2","3","4","5","6","7","7","6","5","4","3","2","1","0"],
      ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],
    ];
    return arr;
  }

  shouldComponentUpdate(){
    return true;
  }

  componentDidUpdate(){
    if(this.hasLine){
      lines.map((line)=>{
        return newSquare[line.x][line.y] = 0;
      })
      newSquare[this.state.square1.x][this.state.square1.y] = newSquare[this.state.square2.x][this.state.square2.y]  = 0;

      setTimeout(
          ()=>{
            this.setState({
              square: newSquare,
              square1: null,
              square2: null
            });
          }, 1000
      );
      this.hasLine = false;
      lines = [];
      return;
    }

    if(this.state.square1 && this.state.square2){
      newSquare = this.state.square.slice();
      if(!this.isPair(this.state.square1, this.state.square2)){
        lines = [];
        this.setState({
          square1: null,
          square2: null
        })
      }else{
        if(lines.length > 0){
          lines.map((line)=>{
            return newSquare[line.x][line.y] = line.value;
          })
        }

        this.setState({
          // square: newSquare,
          score: this.state.score + 10
        });

        this.hasLine = true;
      }


    }

    console.log(this.state.square1);
    console.log(this.state.square2);
  }


  handleClick = (i, j)=>{
    if(!this.state.square1){
      this.setState({
        square1:{x: i, y: j},
        valueSquare1: this.state.square[i][j],
      });
      return;
    }

    if(!this.state.square2){
      this.setState({
        square2:{x: i, y: j},
        valueSquare2: this.state.square[i][j],
      });
    }
  }

  // In the same row
  checkLineX = (y1, y2, x) => {
    const yleft = Math.min(y1, y2);
    const yright = Math.max(y1, y2);
    const tmp = [];

    for( let yi = yleft + 1; yi < yright; yi++) {
      if(this.state.square[x][yi] !== 0) {
        return false;
      }

      tmp.push({x: x, y: yi, value: 'horizontal'});
    }

    lines.push(...tmp);
    return true;
  };
  checkLineY = (x1, x2, y) => {
    const xup = Math.min(x1, x2);
    const xdown = Math.max(x1, x2);
    const tmp = [];

    for( let xi = xup + 1; xi < xdown; xi++) {
      if(this.state.square[xi][y] !== 0) {
        return false;
      }
      tmp.push({x: xi, y: y, value: 'vertical'});
    }

    lines.push(...tmp);
    return true;
  };

  checkRectX = (p1, p2) => {
    let pLeft = p1;
    let pRight = p2;


    if(p1.y > p2.y){
      pLeft = p2;
      pRight = p1;
    }

    lines = [];

    for(let yi = pLeft.y + 1; yi < pRight.y; yi++){
      if(this.checkLineX(pLeft.y, yi, pLeft.x) && this.checkLineY(pLeft.x, pRight.x , yi) && this.checkLineX(yi, pRight.y, pRight.x) && this.state.square[pLeft.x][yi] === 0 && this.state.square[pRight.x][yi] === 0){
        if(pLeft.x > pRight.x){
          lines.push({x : pLeft.x, y : yi, value : 'top_left'}, {x : pRight, y : yi, value : 'bottom_right' });
        }else{
          lines.push({x : pLeft.x, y : yi, value : 'bottom_right'}, {x : pRight, y : yi, value : 'top_left' });
        }
      }
    }
    return false;
  }

  checkRectY = (p1, p2) => {
    let pAbove = p1;
    let pBottom = p2;

    if(p1.x > p2.x){
      pAbove = p2;
      pBottom = p1;
    }

    lines = [];

    for(let xi = pAbove.x + 1; xi < pBottom.x; xi++){
      if(this.checkLineY(pAbove.x, xi, pAbove.y) && this.checkLineX(pAbove.y, pBottom.y, xi) && this.checkLineY(xi, pBottom.x, pBottom.y) && this.state.square[xi][pAbove.y] === 0 && this.state.square[xi][pBottom.y] === 0){
        if(pAbove.y > pBottom.y){
          lines.push({x : xi, y : pAbove.y, value : 'top_left'}, {x : xi, y : pBottom.y, value : 'bottom_right' });
        }else{
          lines.push({x : xi, y : pAbove.y, value : 'top_right'}, {x : xi, y : pBottom.y, value : 'bottom_left' });
        }
        return true;
      }
    }
    return false;
  }

  checkCorner(p1, p2){
    let pLeft = p1;
    let pRight = p2;

    if(p1.y > p2.y){
      pLeft = p2;
      pRight = p1;
    }

    let p = {x: pRight.x, y: pLeft.y};
    if(this.state.square[p.x][p.y] === 0) {
      lines = [];

      if(this.checkLineX(p.y, pRight.y, p.x) && this.checkLineY(p.x, pLeft.x, p.y)) {
        if(pLeft.x > pRight.x) {lines.push({x: p.x, y: p.y, value: 'bottom_right'});} else {lines.push({x: p.x, y: p.y, value: 'top_right'});}
        return true;
      }
    }

    lines = [];
    p = {x: pLeft.x, y: pRight.y};
    if(this.state.square[p.x][p.y] !== 0) return false;

    if(this.checkLineX(p.y, pLeft.y, p.x) && this.checkLineY(p.x, pRight.x, p.y)) {
      if(pLeft.x > pRight.x) {lines.push({x: p.x, y: p.y, value: 'top_left'});} else {lines.push({x: p.x, y: p.y, value: 'bottom_left'});}
      return true;
    }

    return false;
  }


  checkExtendX = (p1, p2, maxY) => {
    let pleft = p1;
    let pright = p2;

    if(p1.y > p2.y){
      pleft = p2;
      pright = p1;
    }

    //left to right
    lines = [];
    for(let yi = pleft.y + 1; yi <= pright.y; yi++) {
      lines.push({x: pleft.x, y: yi, value: 'horizontal'});
    }

    for(let yi = pright.y + 1; yi <= maxY + 1; yi++) {
      lines.push({x: pleft.x, y: yi, value: 'horizontal'}, {x: pright.x, y: yi, value: 'horizontal'});

      if(this.checkLineX(pleft.y, yi, pleft.x) && this.checkLineX(pright.y, yi, pright.x) && this.checkLineY(pleft.x, pright.x, yi) && this.state.square[pleft.x][yi] === 0 && this.state.square[pright.x][yi] === 0) {
        if(pleft.x > pright.x) {
          lines.push({x: pleft.x, y: yi, value: 'top_left'}, {x: pright.x, y: yi, value: 'bottom_left'});
        }else{
          lines.push({x: pleft.x, y: yi, value: 'bottom_left'}, {x: pright.x, y: yi, value: 'top_left'});
        }

        return true;
      }
    }

    // right to left
    lines = [];
    for(let yi = pright.y - 1; yi >= pleft.y; yi--) {
      lines.push({x: pright.x, y: yi, value: 'horizontal'});
    }
    for(let yi = pleft.y - 1; yi >= 0; yi--) {
      lines.push({x: pleft.x, y: yi, value: 'horizontal'}, {x: pright.x, y: yi, value: 'horizontal'});

      if(this.checkLineX(pleft.y, yi, pleft.x) && this.checkLineX(pright.y, yi, pright.x) && this.checkLineY(pleft.x, pright.x, yi) && this.state.square[pleft.x][yi] === 0 && this.state.square[pright.x][yi] === 0) {
        if(pleft.x > pright.x) {
          lines.push({x: pleft.x, y: yi, value: 'top_right'}, {x: pright.x, y: yi, value: 'bottom_right'});
        }else{
          lines.push({x: pleft.x, y: yi, value: 'bottom_right'}, {x: pright.x, y: yi, value: 'top_right'});
        }
        return true;
      }
    }

    return false;
  };

  checkExtendY = (p1, p2, maxX) => {
    let pup = p1;
    let pdown = p2;

    if(p1.x > p2.x){
      pup = p2;
      pdown = p1;
    }

    //up to down
    lines = [];
    for(let xi = pup.x + 1; xi <= pdown.x; xi++) {
      lines.push({x: xi, y: pup.y, value: 'vertical'});
    }

    for(let xi = pdown.x + 1; xi <= maxX + 1; xi++) {
      lines.push({x: xi, y: pup.y, value: 'vertical'}, {x: xi, y: pdown.y, value: 'vertical'});
      console.log('lines:', lines); // See Log
      if(this.checkLineY(pup.x, xi, pup.y) && this.checkLineY(pdown.x, xi, pdown.y) && this.checkLineX(pup.y, pdown.y, xi) && this.state.square[xi][pup.y] === 0 && this.state.square[xi][pdown.y] === 0) {
        if(pup.y > pdown.y) {
          lines.push({x: xi, y: pup.y, value: 'top_left'}, {x: xi, y: pdown.y, value: 'top_right'});
        }else{
          lines.push({x: xi, y: pup.y, value: 'top_right'}, {x: xi, y: pdown.y, value: 'top_left'});
        }
        return true;
      }
    }

    // down to up
    lines = [];
    for(let xi = pdown.x - 1; xi >= pup.x; xi--) {
      lines.push({x: xi, y: pdown.y, value: 'vertical'});
    }
    for(let xi = pup.x - 1; xi >= 0; xi--) {
      lines.push({x: xi, y: pup.y, value: 'vertical'}, {x: xi, y: pdown.y, value: 'vertical'});
      if(this.checkLineY(pup.x, xi, pup.y) && this.checkLineY(pdown.x, xi, pdown.y) && this.checkLineX(pup.y, pdown.y, xi) && this.state.square[xi][pup.y] === 0 && this.state.square[xi][pdown.y] === 0) {
        if(pup.y > pdown.y) {
          lines.push({x: xi, y: pup.y, value: 'bottom_left'}, {x: xi, y: pdown.y, value: 'bottom_right'});
        }else{
          lines.push({x: xi, y: pup.y, value: 'bottom_right'}, {x: xi, y: pdown.y, value: 'bottom_left'});
        }
        return true;
      }
    }

    return false;
  };


  isPair = (p1, p2) => {
    if(!p1 || !p2){
      throw Error('p1, p2 phai co gia tri')
    }

    let x1 = p1.x;
    let y1 = p1.y;

    let x2 = p2.x;
    let y2 = p2.y;
    debugger;
    if(this.state.square[x1][y1] !== this.state.square[x2][y2]){
      return false;
    }
    debugger;
    if(this.state.square1.x === this.state.square2.x && this.state.square1.y === this.state.square2.y){
      return false;
    }
    debugger;
    if(this.state.square[x1][y1] === this.state.square[x2][y2] === 0){
      return false;
    }
    debugger;
    if(x1 === x2 && this.checkLineX(y1, y2, x1)){
      return true;
    }
    debugger;
    if(y1 === y2 && this.checkLineY(x1, x2, y1)){
      return true;
    }
    debugger;
    if(x1 !== x2 && this.checkRectX(p1, p2)){
      return true;
    }
    debugger;
    if(x1 !== x2 && this.checkRectY(p1, p2)){
      return true;
    }
    debugger;
    if(x1 === x2 - 1 &&this.checkCorner(p1, p2)){
      return true;
    }
    debugger;
    if(this.checkExtendX(p1, p2, row)){
      return true;
    }
    debugger;
    if(this.checkExtendY(p1, p2, col)){
      return true;
    }
    debugger;
    return false;
    console.log('isPair():', isPair()); // See Log
  }


  render(){
    // MixPokemon = () =>{
      //   if(this.state.mix_times > 0){
      //     let arr1 = this.state.square;
      //     for(let i = 0; i < row; i++){
      //       for(let j = 0; j < col; j++){
      //         if(arr1[i][j] !== 0){
      //           let newSquare = arr1.slice();
      //           newSquare[i][j] = Math.floor(Math.random() * amount) + 1;
      //           this.setState({
      //             square: newSquare,
      //             mix_times: this.state.mix_times - 1
      //           });
      //         }
      //       }
      //     }
      //   }
      // }
    return(
        <div className="game">
          <div className="game-board">
            <Board
                square = {this.state.square}
                onClick = {this.handleClick}
                square1 = {this.state.square1}
                square2 = {this.state.square2}
            />
          </div>
          <div> Score: {this.state.score}</div>
          {/*<hr/>*/}
          {/*<button onClick={this.MixPokemon} id="mix_button">Mix</button>*/}
          {/*<p>Mix times: {this.state.mix_times}</p>*/}
        </div>
    );
  }
}

export default App;

