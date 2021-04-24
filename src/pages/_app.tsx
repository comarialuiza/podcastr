import { useState } from 'react';
import '../../styles/index.css';
import '../../styles/unreset.scss';
import Header from '../components/Header';
import Player from '../components/Player';

import PlayerContext from '../contexts/playerContext';

function MyApp({ Component, pageProps }) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const play = (episode) => {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
	}

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	}

	const setPlayingState = (state: boolean) => {
		setIsPlaying(state);
	}

	return (
		<PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
			<div className='h-screen bg-gray-200 flex'>
				<main className='flex-1'>
					<Header />
					<Component {...pageProps} />
				</main>
				<Player />
			</div>
		</PlayerContext.Provider>
	)
};

export default MyApp;
