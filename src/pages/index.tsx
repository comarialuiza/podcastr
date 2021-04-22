import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

interface Episode {
	id: string;
	title: string;
	thumbnail: string;
	members: string;
	publishedAt: string;
	duration: string;
	url: string;
}

interface HomeProps {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
}

const Home = ({
	latestEpisodes: latestEpisodesData,
	allEpisodes: allEpisodesData
}: HomeProps) => {
	const getTd = (content: string, className?: string) => (
		<td className={ `p-2 text-gray-600 text-sm font-serif ${ className }` }>{ content }</td>
	);

	const getTh = (content: string, className?: string) => (
		<th className={ `p-2 uppercase text-xs font-light text-gray-500 ${ className }` }>{ content }</th>
	);

	const latestEpisodes = latestEpisodesData.map((episode: Episode) => (
		<li
			key={ episode.id }
			className='bg-white p-4 rounded flex items-center relative'
		>
			<Image
				src={ episode.thumbnail }
				alt={ episode.title }
				width={ 100 }
				height={ 100 }
				objectFit='cover'
				className='rounded flex-shrink-0 w-24 h-24'
			/>

			<div className='ml-4' style={{ width: 'calc(100% - 8rem)' }}>
				<Link href={ `/episodes/${ episode.id }` }>
					<a className='text-base h-12 mb-2 block overflow-hidden font-serif'>{ episode.title }</a>
				</Link>
				<p className='text-sm text-gray-400 whitespace-nowrap overflow-ellipsis overflow-hidden font-serif' style={{ width: '90%' }}>{ episode.members }</p>
				<span className='mr-2 text-xs text-gray-400'>{ episode.publishedAt }</span>
				<span className='text-xs text-gray-400'>{ episode.duration }</span>

				<button type='button' className='absolute -bottom-2 -right-2 bg-purple-200 p-2 rounded' style={{ fontSize: 0 }}>
					<Image src='/play-green.svg' alt='Tocar episódio' width={ 25 } height={ 25 } />
				</button>
			</div>
		</li>
	));

	const allEpisodes = allEpisodesData.map((episode: Episode) => (
		<tr key={ episode.id }>
			<td className='p-2'>
				<Image
					width={ 120 }
					height={ 120 }
					src={ episode.thumbnail }
					alt={ episode.title }
					objectFit='cover'
					className='w-4 h-4 rounded'
				/>
			</td>

			<td className='p-2 text-gray-600 text-sm font-serif'>
				<Link href={ `/episodes/${ episode.id }` }>
					<a>{ episode.title }</a>
				</Link>
			</td>
			{ getTd(episode.members) }
			{ getTd(episode.publishedAt, 'whitespace-nowrap text-center') }
			{ getTd(episode.duration, 'whitespace-nowrap text-center') }

			<td className='p-2 w-12 h-12'>
				<button type='button' className='bg-purple-400 bg-opacity-20 p-2 rounded' style={{ fontSize: 0 }}>
					<Image src='/play-green.svg' alt='Tocar episódio' width={ 20 } height={ 20 } className='w-8 h-8'/>
				</button>
			</td>
		</tr>
	));

	return (
		<div className='p-16 overflow-scroll' style={{ height: 'calc(100% - 136px)' }}>
			<section>
				<h2 className='mb-4 font-serif'>Últimos lançamentos</h2>

				<ul className='grid gap-4 grid-cols-2'>
					{ latestEpisodes }
				</ul>
			</section>

			<section className='mt-12'>
				<h2 className='mb-4 font-serif'>Todos os episódios</h2>

				<table cellSpacing={ 0 } className='table-auto'>
					<thead>
						<th></th>
						{ getTh('Podcast', 'text-left') }
						{ getTh('Integrantes', 'text-left') }
						{ getTh('Data') }
						{ getTh('Duração') }
						<th></th>
					</thead>

					<tbody>
						{ allEpisodes }
					</tbody>
				</table>
			</section>
		</div>
	)
};

export default Home;

export const getStaticProps: GetStaticProps = async () =>  {
	const { data } = await api.get('episodes', {
		params: {
			_limit: 12,
			_sort: 'published_at',
			_order: 'desc'
		}
	});

	const episodes = data.map(episode => {
		return {
			id: episode.id,
			title: episode.title,
			thumbnail: episode.thumbnail,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
			duration: convertDurationToTimeString(episode.file.duration),
			url: episode.file.url
		}
	});

	const eightHours = 60 * 60 * 8;

	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.length);

	return {
		props: {
			latestEpisodes, allEpisodes
		},
		revalidate: eightHours
	}
};