import { FC } from 'react';
import { ButtonImgProps } from '@ui/ButtonImg/ButtonImg.typings';
import classNames from 'classnames';

import './index.scss';

export const ButtonImg: FC<ButtonImgProps> = ({ variant = 'close', onClick, ...props }) => {
  return (
    <div
      className={classNames('button-img', 'button-img_' + variant)}
      onClick={onClick}
      {...props}></div>
  );
};
