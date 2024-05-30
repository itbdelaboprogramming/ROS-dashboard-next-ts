import React from 'react';
import styles from './controlInstruction.module.css';

interface ControlInstructionProps {
  onClick: () => void;
  imgUrl: string;
  width?: number; // Optional width property
  height?: number; // Optional height property
}

const ControlInstruction: React.FC<ControlInstructionProps> = ({ onClick, imgUrl, width, height }) => {
  const style = {
    width:  `auto`,
    height:  `auto`,
    borderRadius:`12px`,
  };

  return (
    <div className={`${styles.ControlInstruction} ${styles.mobileHide}`} onClick={onClick}>
      <img src={imgUrl} alt="" style={style} />
    </div>
  );
};

export default ControlInstruction;
