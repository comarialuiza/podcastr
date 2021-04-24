import { createContext, useState, ReactNode } from 'react';

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

	const setPlayingState = (state: boolean) => {
		setIsPlaying(state);
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
                playList
            }}
        >
            { children }
        </PlayerContext.Provider>
    );
}