import PropTypes from "prop-types";

function Square({ index, onClick, player }) {
  const scaleClass = player ? "scale-100" : "scale-0";
  const textColorClass =
    player === "X" ? "yellow" : "fuschia";
  const hoverStyleClass = "transition-scale";

  return (
    <div
      data-cell-index={index}
      className={`square ${hoverStyleClass}`}
      onClick={onClick}
    >
      <span
        data-cell-index={index}
        className={`${scaleClass} ${textColorClass}`}
      >
        {player}
      </span>
    </div>
  );
}

Square.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  player: PropTypes.string,
};

export default Square;
