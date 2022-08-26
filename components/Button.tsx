import React from 'react';

type ButtonProps = {
  classStyles?: string;
  btnName: string;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = ({ classStyles, btnName, handleClick }: ButtonProps) => (
  <button
    type="button"
    className={`techive-nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`}
    onClick={handleClick}
  >
    {btnName}
  </button>
);

Button.defaultProps = {
  classStyles: '',
  handleClick: () => {},
};

export default Button;
