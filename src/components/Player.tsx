import Image from 'next/image';
import { useContext } from 'react';
import PlayerContext from '../contexts/playerContext';

function Player() {
    const { episodeList, currentEpisodeIndex } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];

    const getPlayerTime = (time: string) => (
        <span className='text-center'>{ time }</span>
    );

    const playerTimeStart = getPlayerTime('00:00');
    const playerTimeEnd = getPlayerTime('00:00');
    
    const getButton = (image: string, alt: string, isMainButton: boolean = false) => {
        const mainButtonClasses = isMainButton ? 'w-16 h-16 bg-purple-400 rounded bg-opacity-40' : null;

        return (
            <button
                type='button'
                className={ mainButtonClasses }
                style={{ fontSize: 0 }}
            >
                <Image src={ `/${ image }.svg` } alt={ alt } width={ 25 } height={ 25 } className='opacity-50'/>
            </button>
        );
    };

    const shuffleButton = getButton('shuffle', 'Embaralhar');
    const previousButton = getButton('play-previous', 'Tocar anterior');
    const playButton = getButton('play', 'Tocar', true);
    const nextButton = getButton('play-next', 'Tocar próxima');
    const repeatButton = getButton('repeat', 'Repetir');

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

            <div className='w-full h-80 rounded-2xl bg-opacity-20 bg-white flex items-center justify-center p-8 '>
                <p className='text-2xl text-center font-serif'>Selecione um podcast para ouvir</p>
            </div>

            <footer className='self-stretch w-full'>
                <div className='flex items-center gap-2 text-xs'>
                    { playerTimeStart }
                    <div className='w-full h-1 bg-purple-400 rounded'/>
                    { playerTimeEnd }
                </div>
                
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