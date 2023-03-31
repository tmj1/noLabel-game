import { FC, useCallback, useEffect, useState } from 'react';
// icons
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5';
import { ControlsProps } from '@components/Controls/Controls.typing';

import './index.scss';

const Controls: FC<ControlsProps> = ({ audioRef, progressBarRef, duration, setTimeProgress }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // const playAnimationRef  = useRef();

  const repeat = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    progressBarRef.current.value = currentTime;
    progressBarRef.current.style.setProperty(
      '--range-progress',
      `${(progressBarRef.current.value / duration) * 100}%`
    );

    // playAnimationRef.current = requestAnimationFrame(repeat);
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    // playAnimationRef.current = requestAnimationFrame(repeat);
  }, [isPlaying, audioRef, repeat]);

  return (
    <div className='controls-wrapper'>
      <div className='controls'>
        <button onClick={togglePlayPause}>{isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}</button>
      </div>
    </div>
  );
};

export default Controls;
