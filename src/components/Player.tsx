import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import PlayerContext from '../contexts/playerContext';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

function Player() {
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState
    } = useContext(PlayerContext);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        isPlaying ? audio.play() : audio.pause();
    }, [isPlaying]);

    const episode = episodeList[currentEpisodeIndex];

    const getPlayerTime = (time: string) => (
        <span className='text-center'>{ time }</span>
    );

    const playerTimeStart = getPlayerTime('00:00');
    const playerTimeEnd = getPlayerTime('00:00');

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
            <p className='text-2xl text-center font-serif'>Selecione um podcast para ouvir</p>
        </div>
    )

    const disableButton = !episode;
    
    const getButton = (
        image: string,
        alt: string,
        isMainButton: boolean = false,
        onClick?: () => void
    ) => {
        const buttonClasses = isMainButton ?
            'w-16 h-16 bg-purple-400 rounded bg-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed' :
            'disabled:opacity-50 disabled:cursor-not-allowed';

        return (
            <button
                type='button'
                className={ buttonClasses }
                style={{ fontSize: 0 }}
                disabled={ disableButton }
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

    const shuffleButton = getButton('shuffle', 'Embaralhar');
    const previousButton = getButton('play-previous', 'Tocar anterior');
    const nextButton = getButton('play-next', 'Tocar próxima');
    const repeatButton = getButton('repeat', 'Repetir');

    let playButton = getButton('play', 'Tocar', true, togglePlay);

    const slider = episode ? (
        <Slider
            trackStyle={{ backgroundColor: '#f8c045' }}
            railStyle={{ backgroundColor: '#9f75ff'}}
            handleStyle={{ borderColor: '#f8c045'}}
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
        />
    ) : null;

    const playingButton = isPlaying ? (
        playButton = getButton('pause', 'Tocar', true, togglePlay)
    ) : (
        playButton = getButton('play', 'Tocar', true, togglePlay)
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
                <strong className='font-serif text-sm'>Tocando agora</strong>
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
                    { playingButton }
                    { nextButton }
                    { repeatButton }
                </div>
            </footer>
        </div>
    );
}

export default Player;