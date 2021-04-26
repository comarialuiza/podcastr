import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../contexts/playerContext';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';


function Player() {
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    } = usePlayer();

    const [progress, setProgress] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        isPlaying ? audio.play() : audio.pause();
    }, [isPlaying]);

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    const handleEpisodeEnded = () => {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    const episode = episodeList[currentEpisodeIndex];

    const getPlayerTime = (time: string | number) => (
        <span className='text-center'>{ time }</span>
    );

    const playerTimeStart = getPlayerTime(convertDurationToTimeString(progress));
    const playerTimeEnd = getPlayerTime(convertDurationToTimeString(episode?.duration ?? 0));

    const podcastInfo = episode ? (
        <div className='text-center'>
            <Image
                src={ episode.thumbnail }
                alt={ episode.title }
                objectFit='cover'
                width={ 592 }
                height={ 592 }
                className='rounded'
            />
            <p className='mt-4 font-bold'>{ episode.title }</p>
            <p className='text-sm mt-4'>{ episode.members }</p>
        </div>
    ) : (
        <div className='w-full h-80 rounded-2xl bg-opacity-20 bg-white flex items-center justify-center p-8 '>
            <p className='text-2xl text-center '>Selecione um podcast para ouvir</p>
        </div>
    )
    
    const getButton = (
        image: string,
        alt: string,
        onClick?: () => void,
        disabled?: boolean,
        isMainButton: boolean = false
    ) => {
        const buttonClasses = isMainButton ?
            'w-16 h-16 bg-purple-400 rounded bg-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed' :
            'disabled:opacity-50 disabled:cursor-not-allowed';

        const disabledButton = !episode || disabled;

        return (
            <button
                type='button'
                className={ buttonClasses }
                style={{ fontSize: 0, backgroundColor: disabledButton ? 'red' : 'blue' }}
                disabled={ disabledButton }
                onClick={ onClick }
            >
                <Image
                    src={ `/${ image }.svg` }
                    alt={ alt }
                    width={ 25 }
                    height={ 25 }
                />
            </button>
        );
    };

    const shuffleButton = getButton('shuffle', 'Embaralhar', toggleShuffle, episodeList.length === 1);
    const previousButton = getButton('play-previous', 'Tocar anterior', playPrevious, !hasPrevious);
    const nextButton = getButton('play-next', 'Tocar próxima', playNext, hasNext);
    const repeatButton = getButton('repeat', 'Repetir', toggleLoop, episodeList.length === 1);

    const slider = episode ? (
        <Slider
            trackStyle={{ backgroundColor: '#f8c045' }}
            railStyle={{ backgroundColor: '#9f75ff'}}
            handleStyle={{ borderColor: '#f8c045'}}
            max={ episode.duration }
            value={ progress }
            onChange={ handleSeek }
        />
    ) : (
        <div className='w-full h-1 bg-purple-400 rounded'/>
    );

    const onPlay = () => setPlayingState(true);
    const onPause = () => setPlayingState(false);

    const player = episode ? (
        <audio
            src={ episode.url }
            autoPlay
            ref={ audioRef }
            onPlay={ onPlay }
            onPause={ onPause }
            loop={ isLooping }
            onLoadedMetadata={ setupProgressListener }
            onEnded={ handleEpisodeEnded }
        />
    ) : null;

    const playButton = isPlaying ? (
        getButton('pause', 'Tocar', togglePlay, false, true)
    ) : (
        getButton('play', 'Tocar', togglePlay, false, true)
    );

    return (
        <div className='
            w-96 h-screen
            bg-gradient-to-b from-purple-400 via-pink-500 to-red-500
            flex flex-col items-center justify-between
            text-white
            py-8 px-10
        '>
            <header className='flex items-center gap-8'>
                <Image src='/playing.svg' alt='Tocando agora' width={ 50 } height={ 50 }/>
                <strong className=' text-sm'>Tocando agora</strong>
            </header>

            { podcastInfo }

            <footer className='self-stretch w-full'>
                <div className='flex items-center gap-2 text-xs'>
                    { playerTimeStart }
                    { slider }
                    { playerTimeEnd }
                </div>

                { player }
                
                <div className='flex items-center justify-center mt-10 gap-6'>
                    { shuffleButton }
                    { previousButton }
                    { playButton }
                    { nextButton }
                    { repeatButton }
                </div>
            </footer>
        </div>
    );
}

export default Player;