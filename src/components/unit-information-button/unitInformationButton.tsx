import React from 'react';
import styles from './unitInformationButton.module.css';

interface UnitInformationButton {
    onClick: () => void;
}

const ButtonInformation: React.FC<UnitInformationButton> = ({ onClick }) => {
    return (
        <div className={`${styles.bottomLeftElement} ${styles.mobileDisplayNone}`} onClick={onClick}>
            <img src="/icons/Info.svg" alt="" />
        </div>
    );
};

export default ButtonInformation;
