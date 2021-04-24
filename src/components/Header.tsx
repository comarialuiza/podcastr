import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';

function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    });

    return (
        <header className='
            bg-white
            p-16 h-24
            flex items-center
            border-b-8 border-yellow-400
        '>
            <Image src='/logo.svg' alt='Podcastr' width={ 163 } height={ 40 }/>

            <p className=' text-gray-700 text-sm px-10 mx-10 border-l-2'>
                O melhor para você ouvir sempre
            </p>

            <span className=' ml-auto text-sm capitalize'>{ currentDate }</span>
        </header>
    );
}

export default Header;