import React from "react";
import PropTypes from "prop-types";
import Square from "./Square";
class Board extends React.Component {
  renderSquare(i, j, selected) {
    return (
      <Square
        key={`${i}_${j}`}
        value={this.props.square[i][j]}
        onClick={() => this.props.onClick(i, j)}
        selected={selected}
      />
    );
  }

  render() {
    const { square, square1, square2 } = this.props;
    const boardGame = square.map((item, i) => (
      <div key={i} className="board-row">
        {item.map((square, j) => {
          let selected = false;

          if (square1 && square1.x === i && square1.y === j) {
            selected = true;
          } else if (square2 && square2.x === i && square2.y === j) {
            selected = true;
          }
          return this.renderSquare(i, j, selected);
        })}
      </div>
    ));

    return <div>{boardGame}</div>;
  }
}

Board.propTypes = {
  square: PropTypes.array,
  square1: PropTypes.object,
  square2: PropTypes.object,
  onClick: PropTypes.func,
};

export default Board;
