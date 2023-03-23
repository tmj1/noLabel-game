import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@components/Button';
import { Rating } from '@components/Leaderboard';
import { LogoText } from '@components/LogoText';
import { Spacer } from '@ui/Spacer';

import './index.scss';
import '@assets/styles/App.scss';

export const StartScreen = () => {
  const navigate = useNavigate();

  return (
    <div className='container-content container-content_main bg-image'>
      <div className='container_center colum-8 container-start-screen' style={{ marginLeft: 0 }}>
        <LogoText />
        <Button
          text='Начать игру'
          onClick={() => navigate('/login')}
          className='button button_primary'
          style={{ margin: 20 }}
        />

        <Link className='plane-link' to='/registration' style={{ marginBottom: 20 }}>
          Нет аккаунта?
        </Link>
        <Spacer />
      </div>
      <div className='container colum-3' style={{ paddingLeft: 20 }}>
        <Rating />
      </div>
    </div>
  );
};
