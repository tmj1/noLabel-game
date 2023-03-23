import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeUser } from '@components/Autification/slice';
import { Button } from '@components/Button';
import { UserCard } from '@components/UserCard';
import { currentUser } from '@store/selectors';
import { Spacer } from '@ui/Spacer';
import { useAppDispatch } from '@utils/hooks/reduxHooks';
import { showError } from '@utils/ShowError';

import './index.scss';

export const Header = () => {
  const user = useSelector(currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logOut = async () => {
    dispatch(removeUser());
    fetch('https://ya-praktikum.tech/api/v2/auth/logout', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        toast.success('Вы вышли из профиля!');
        navigate('/');
      })
      .catch(() => showError());
  };

  return (
    <>
      <div className='header'>
        <div className='header__logo'></div>
        <div className='header__container header__container_link-autch'>
          <div className='header__container header__container_link'>
            <Link to={'/'} className='custom-link'>
              Главная
            </Link>
            <Link to={'/game'} className='custom-link'>
              Игра
            </Link>
            <Link to={'/rating'} className='custom-link'>
              Рейтинг
            </Link>
            <Link to={'/forum'} className='custom-link'>
              Форум
            </Link>
          </div>
          {!user.login ? (
            <div className='header__container header__container_autch'>
              <Button text={'ВХОД'} onClick={() => navigate('/login')} />
            </div>
          ) : (
            <div style={{ cursor: 'pointer' }}>
              <UserCard
                avatarUrl={
                  user.avatar
                    ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
                    : undefined
                }
                variant='header'
                userName={user.login ?? 'Игрок'}
                clickCard={() => navigate('/profile')}
                clickButton={logOut}
              />
            </div>
          )}
        </div>
      </div>
      <Spacer />
    </>
  );
};
