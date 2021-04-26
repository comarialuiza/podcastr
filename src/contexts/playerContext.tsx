import { createContext, useState, ReactNode, useContext } from 'react';

interface Episode {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

interface PlayerContextData {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    toggleLoop: () => void;
    isShuffling: boolean;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
}

interface PlayerContextProviderProps {
    children: ReactNode;
}

const PlayerContext = createContext({} as PlayerContextData);

export default PlayerContext;

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
    const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

	const play = (episode: Episode) => {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
    }
    
    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
    }
    
    const toggleLoop = () => {
        setIsLooping(!isLooping);
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    }

	const setPlayingState = (state: boolean) => {
		setIsPlaying(state);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || currentEpisodeIndex <= episodeList.length;
    
    const playNext = () => {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    const playPrevious = () => {
        if (isShuffling) {
            const previousRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(previousRandomEpisodeIndex);
        } else if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    const clearPlayerState = () => {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

	return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                isPlaying,
                togglePlay,
                setPlayingState,
                playList,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                isLooping,
                toggleLoop,
                isShuffling,
                toggleShuffle,
                clearPlayerState
            }}
        >
            { children }
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}