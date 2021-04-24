import '../../styles/index.css';
import '../../styles/unreset.scss';
import Header from '../components/Header';
import Player from '../components/Player';

import { PlayerContextProvider } from '../contexts/playerContext';

function MyApp({ Component, pageProps }) {
	return (
		<PlayerContextProvider>
			<div className='h-screen bg-gray-200 flex'>
				<main className='flex-1'>
					<Header />
					<Component {...pageProps} />
				</main>
				<Player />
			</div>
		</PlayerContextProvider>
	)
};

export default MyApp;
