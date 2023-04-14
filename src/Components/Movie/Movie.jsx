import { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import YouTube from 'react-youtube'
import { ImSearch } from "react-icons/im";
import Loading from '../Loading/Loading';
import noImg from '../../Img/noimg.jpg'

const Movie = () => {
    const API_URL = 'https://api.themoviedb.org/3';
    const API_KEY = 'a2372e9d2c1613dc68993cda623b7b0e';
    const URL_IMG = 'https://image.tmdb.org/t/p/original';

    const [movies, setMovies] = useState([]);
    const [mov, setMov] = useState({ title: 'Loading Movies' });
    const [modKey, setModKey] = useState('');
    const [trailer, setTrailer] = useState(null);
    const [play, setPlay] = useState(false);
    const [load, setLoad] = useState(false);

    const fetchMovie = useCallback( async (modKey) => {
        // mediante el type consigo filtrar informacion de la pelicula requerida
        const type = modKey ? 'search' : 'discover';
        const { data: { results }, } = await axios.get(`${API_URL}/${type}/movie`, {
            params: {
                api_key: API_KEY,
                query: modKey,
            },
        });
        setMovies(results)
        setMov(results[0])

        if (results.length) {
            await fetchTrailer(results[0].id)
        }
    },[])

    // funciona para la peticion de un solo objeto y mostrar el reproductor
    const fetchTrailer = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: 'videos'
            }
        })
        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(
                (v) => v.name === 'Official Trailer'
            );
            setTrailer(trailer ? trailer : data.videos.results[0])
        }
        setMov(data)
    }

    const selecTrailer =(t) => {
        setLoad(true)
        fetchTrailer(t.id);
        setMov(t)
        window.scrollTo(0,0)
        setTimeout(()=>{
            setLoad(false)
        },1500)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchMovie(modKey);
    }

    useEffect(() => {
        setModKey(fetchMovie());
    },[fetchMovie])

    return (
        <div>
            <div>
                {load ? (
                    <Loading/>
                    ) : (
                        <main>
                        {mov ? (
                            <div className='w-full'>
                                {play ? (
                                    <>
                                        <YouTube
                                            videoId={trailer.key}
                                            className='flex justify-end w-full h-[100vh]'
                                            opts={{
                                                width: '100%',
                                                height: '100%',
                                                playerVars: {
                                                    autoplay: 1,
                                                    controls: 0,
                                                    cc_load_policy: 0,
                                                    fs: 0,
                                                    iv_load_policy: 0,
                                                    modestbranding: 0,
                                                    rel: 0,
                                                    showinfo: 0,
                                                },
                                            }}
                                        />
                                        <button onClick={() => setPlay(false)} className='p-2 bg-gray-100 font-semibold text-yellow-900 flex justify-center w-[60%] max-h-[600px] m-auto'>
                                            Cerrar
                                        </button>
                                    </>
                                ) : (
                                    <div>
                                        <img src={mov.poster_path ? URL_IMG + mov.poster_path : noImg } alt='movie' className='flex justify-start w-full md:w-[60%] rounded-t-lg max-h-[700px] mt-8 m-auto'/>
                                        <div>
                                            {trailer ? (
                                                <button onClick={() => setPlay(true)} className='w-full rounded-b-lg p-2 bg-gray-100 font-semibold text-yellow-900 border-2 border-gray-700 flex justify-center md:w-[60%] max-h-[600px] m-auto'>
                                                    Play Trailer
                                                </button>
                                            ) : (
                                                <p className='flex justify-center font-bold text-red-700 uppercase'>Lo siento, no existe el siguiente trailer</p>
                                            )}
                                            <h1 className='flex justify-center w-[60%] max-h-[600px] m-auto font-bold text-[22px]'>{mov.title}</h1>
                                            <p className='flex justify-start w-full md:w-[60%] max-h-[600px] m-auto'>{mov.overview}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </main>

                )}

            </div>
            <form onSubmit={handleSubmit} className='flex justify-center my-4'>
                <input
                    type='text'
                    placeholder='Buscar Peliculas'
                    className='rounded-lg border border-black p-1 mx-2 w-[80%] md:w-[30%]'
                    onChange={(e) => setModKey(e.target.value)}
                />
                <button>
                    <ImSearch size={24} />
                </button>
            </form>
            <div className='flex flex-wrap justify-around gap-8 sm:m-12'>
                {movies !== null && movies.map((e) => {
                    return (
                        <div onClick={()=>selecTrailer(e)} key={e.id} className='border border-black rounded-md cursor-pointer w-full md:w-[350px]'>
                            <img src={`${e.poster_path ? URL_IMG + e.poster_path : noImg}`} alt='movie' className='min-h-[360px]' />
                            <button className='w-full md:w-[350px] font-semibold text-center bg-gray-100 py-2 hover:text-green-900'>{e.title}</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Movie;