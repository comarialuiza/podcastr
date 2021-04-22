import '../../styles/index.css';
import '../../styles/unreset.scss';
import Header from '../components/Header';
import Player from '../components/Player';

function MyApp({ Component, pageProps }) {
	return (
		<div className='h-screen bg-gray-200 flex'>
			<main className='flex-1'>
				<Header />
				<Component {...pageProps} />
			</main>
			<Player />
		</div>
	)
};

export default MyApp;
