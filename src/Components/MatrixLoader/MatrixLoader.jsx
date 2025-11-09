import React from "react";
import "./MatrixLoader.css";

const MatrixLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="ai-matrix-loader">
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="glow"></div>
      </div>
      <p className="loader-text">Cargando panel...</p>
    </div>
  );
};

export default MatrixLoader;
