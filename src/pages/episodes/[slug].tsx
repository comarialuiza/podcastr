import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import Link from 'next/link';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';

interface Episode {
    id: string;
	title: string;
	thumbnail: string;
	members: string;
	publishedAt: string;
    duration: string;
    description: string;
	url: string;
}

interface EpisodeProps {
    episode: Episode;
}

const Episode = ({ episode }: EpisodeProps) => {
    const router = useRouter();
    const slug = router.query.slug;
    
    return (
        <div className='max-w-2xl p-4 mx-auto my-8'>
            <div className='relative'>
                <Link href='/'>
                    <button
                        type='button'
                        className='absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-400 z-10 p-2 rounded'
                        style={{ fontSize: 0, transform: 'translate(-50%, -50%)' }}
                    >
                        <Image src='/arrow-left.svg' alt='Voltar' width={ 20 } height={ 20 } />
                    </button>
                </Link>

                <Image
                    width={ 700 }
                    height={ 160 }
                    src={ episode.thumbnail }
                    objectFit='cover'
                    className='rounded'
                />

                <Link href='/'>
                    <button
                        type='button'
                        className='absolute right-0 top-1/2 bg-green-400 p-2 rounded'
                        style={{ fontSize: 0, transform: 'translate(50%, -50%)' }}
                    >
                        <Image src='/play.svg' alt='Tocar episódio' width={ 20 } height={ 20 } />
                    </button>
                </Link>
            </div>

            <header>
                <h1 className='mt-4 text-gray-700 text-2xl'>{ episode.title }</h1>

                <div className='space-x-4 my-4 text-sm text-gray-400 divide-solid'>
                    <span>{ episode.members }</span>
                    <span>{ episode.publishedAt }</span>
                    <span>{ episode.duration }</span>
                </div>
            </header>

            <div
                dangerouslySetInnerHTML={{ __html: episode.description }}
                className='text-base text-gray-600 paragraph'
            />
        </div>
    );
}

export default Episode;

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${ slug }`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: convertDurationToTimeString(data.file.duration),
        description: data.description,
        url: data.file.url
    };

    const twentyFourHours = 60 * 60 * 24;

    return {
        props: {
            episode
        },
        revalidate: twentyFourHours
    }
}