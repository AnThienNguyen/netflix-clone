import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from './axios';
import './Row.css';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [currentMovie, setCurrentMovie] = useState([]);

    // A snippet of code which runs based on specific condition/variable
    useEffect(() => {
        // if [], run once when row loads and don't run again
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            //console.log(request);

            setMovies(request.data.results);
            return request;
        }
        fetchData();

    }, [fetchUrl]);

    //console.log(movies);

    const opts = {
        height: "380",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (movie === currentMovie) {
            console.log(currentMovie);
            setCurrentMovie([]);
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || movie?.title || "")
                .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get("v"));
                })
                .catch((error) => {
                    setTrailerUrl("None"); 
                    console.log(error)
                })
            
            setCurrentMovie(movie);
        }
        console.log(movie);
        /*movieTrailer(movie?.name || movie?.title || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                if(trailerUrl != urlParams.get("v")) {
                    setTrailerUrl(urlParams.get("v")); 
                }
                else{
                    setTrailerUrl("")
                }
            })
            .catch((error) => console.log(error));*/
    };
    console.log(trailerUrl);

    return (
        <div className='row'>
            <h2>{ title }</h2>

            <div className='row__posters'>
                {movies.map(movie => (
                    <img 
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"} ${movie === currentMovie && "row__current"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : 
                            (movie.backdrop_path ? movie.backdrop_path : movie.poster_path)}`} 
                        alt={movie.name} />

                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row;
