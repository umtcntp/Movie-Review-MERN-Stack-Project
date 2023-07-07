import MovieCard from '../components/MovieCard';
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import moment from 'moment';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';

const socket = io('/', {
    reconnection: true
})


const Home = () => {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movieAddLike, setMovieAddLike] = useState([]);
  const [movieRemoveLike, setMovieRemoveLike] = useState([])

  //display movies

  const showMovies = async () => {
    setLoading(true);
    try {
        const { data } = await axios.get('/api/movies/show');
        setMovies(data.movies);
        setLoading(false);
    } catch (error) {
        console.log(error.response.data.error);
    }
  }

useEffect(() => {
    showMovies();
}, []);

useEffect(() => {
    socket.on('add-like', (newMovies) => {
        setMovieAddLike(newMovies);
        setMovieRemoveLike('');
    });
    socket.on('remove-like', (newMovies) => {
        setMovieRemoveLike(newMovies);
        setMovieAddLike('');
    });
}, [])

let uiMovies = movieAddLike.length > 0 ? movieAddLike : movieRemoveLike.length > 0 ? movieRemoveLike : movies;


  return (
    <>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
        <Navbar/>
          <Container sx={{ pt: 5, pb: 5, minHeight: "83vh" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {
                                loading ? <Loader /> :

                                    uiMovies.map((movie, index) => (
                                        <Grid item xs={2} sm={4} md={4} key={index} >
                                            <MovieCard
                                                id={movie._id}
                                                movieName={movie.movieName}
                                                description={movie.description}
                                                image={movie.image ? movie.image.url : ''}
                                                subheader={moment(movie.createdAt).format('MMMM DD, YYYY')}
                                                reviews={movie.reviews.length}
                                                likes={movie.likes.length}
                                                likesId={movie.likes}
                                                showMovies={showMovies}
                                            />
                                        </Grid>
                                    ))
                            }
              </Grid>
            </Box>
          </Container>
        <Footer/>  
      </Box>
    </>
  )
}

export default Home