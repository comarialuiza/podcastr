interface File {
	url: string;
	type: string;
	duration: number;
}
interface Episodes {
	id: string;
	title: string;
	members: string;
	published_at: string;
	thumbnail: string;
	description: string;
	file: File;
}

export default function Home(episodes: Episodes) {
	return (
		<div>hello</div>
	)
};

export async function getStaticProps() {
	const response = await fetch('http://localhost:3333/episodes');
	const data = await response.json();

	const eightHours = 60 * 60 * 8;

	return {
		props: {
			episodes: data
		},
		revalidate: eightHours
	}
};