import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import { usePlayer } from '../../contexts/PlayerContext';
import 'rc-slider/assets/index.css'; 
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  //useRef() pega o elemento, "como" o innerHtml, etc
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  // importa o que foi criado em PlayerContext
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toogleLoop,
    toogleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    clearPlayerState,
    hasNext,
    hasPrevious
  } = usePlayer();

  useEffect(() => {
    //current pega os valores do elemento HTML
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      //altera o <audio> para play
      audioRef.current.play();
    } else {
      //altera o <audio> para pause
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  const episode = episodeList[currentEpisodeIndex];

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }
  
  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora </strong>
      </header>
      {  episode ? (
        <div className={styles.currentEpisode}>
          <img src={episode.thumbnail} alt=""/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
        ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
        )  
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ?(
              <Slider
                max = {episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle= {{ backgroundColor: '#04d361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{backgroundColor: '#04d361', borderWidth: 3}}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
         
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {/* toca o audio se possuir episodio */}
        {episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            // funcao do audio
            loop = {isLooping}
            onEnded={handleEpisodeEnded}
            // funções do audio para controlar o play/pause pelo teclado
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            //dispara assim que o player carrega os dados do episodio
            onLoadedMetadata={setupProgressListener}

          />         
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode ||  episodeList.length === 1 }
            onClick={toogleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>
          
          <button type="button"  onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="voltar" />
          </button>
          <button 
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}  
          >
            { isPlaying 
              ? <img src="/pause.svg" alt="Pausar" />
              : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button type="button" disabled={!episode} onClick={toogleLoop} className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>

    </div>
  );
}