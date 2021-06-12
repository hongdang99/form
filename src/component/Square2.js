import React from "react";
import PropTypes from "prop-types";
function Square(value, onClick, selected) {
  return (
    <button
      className={value > 0 ? "square" : "non-square"}
      onClick={onClick}
      style={selected ? { border: "3px solid crimson" } : null}
    >
      <img
        src={`/images/pokemon_${value}.png`}
        style={value === 0 ? { display: "none" } : null}
        alt=""
      />
    </button>
  );
}

Square.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  value: PropTypes.number,
};

export default Square;
