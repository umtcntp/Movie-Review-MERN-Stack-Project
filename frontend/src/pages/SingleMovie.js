import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Divider } from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import moment from 'moment';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { toast } from 'react-toastify';
import CommentList from '../components/CommentList';
import { io } from 'socket.io-client';

const socket = io('/', {
    reconnection: true
})


const SingleMovie = () => {

    useEffect(() =>{
        console.log('SOCKET IO',socket.request)
    },[])


    const { userInfo } = useSelector(state => state.signIn);

    const [movieName, setMovieName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const [commentsRealTime, setCommentsRealTime] = useState([]);




    const { id } = useParams();
    //fetch single movie
    const displaySingleMovie = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/movie/${id}`);
            // console.log(data)
            setMovieName(data.movie.movieName);
            setDescription(data.movie.description);
            setImage(data.movie.image.url);
            setCreatedAt(data.movie.createdAt);
            setLoading(false);
            setReviews(data.movie.reviews);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        displaySingleMovie();
    }, [])

    useEffect(() => {
        // console.log('SOCKET IO', socket);
        socket.on('new-comment', (newComment) => {
            setCommentsRealTime(newComment);
        })
    }, [])


    // add comment
    const addReview = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/api/review/movie/${id}`, { review });
            if (data.success === true) {
                setReview('');
                toast.success("comment added");
                //displaySingleMovie();
                socket.emit('comment', data.movie.reviews);
            }
            //console.log("comment movie", data.movie)
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    let uiCommentUpdate = commentsRealTime.length > 0 ? commentsRealTime : reviews;

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: "#fafafa", display: 'flex', justifyContent: 'center', pt: 4, pb: 4, minHeight: "100vh" }}>
                {
                    loading ? <Loader /> :
                        <>
                            <Card sx={{ maxWidth: 1000, height: '100%' }}>
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                            M
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    movieName={movieName}
                                    subheader={moment(createdAt).format('MMMM DD, YYYY')}
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={image}
                                    alt={movieName}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        <Box component='span' dangerouslySetInnerHTML={{ __html: description }}></Box>
                                    </Typography>
                                    <Divider variant="inset" />
                                    {/* add coment list */}
                                    {
                                        reviews.length === 0 ? '' :
                                            <Typography variant='h5' sx={{ pt: 3, mb: 2 }}>
                                                Reviews:
                                            </Typography>
                                    }

                                    {
                                        uiCommentUpdate.map(review => (
                                            <CommentList key={review._id} name={review.addeddBy.name} text={review.text} />

                                        ))
                                    }

                                    {
                                        userInfo ?
                                            <>
                                                <Box sx={{ pt: 1, pl: 3, pb: 3, bgcolor: "#fafafa" }}>
                                                    <h2>Add your review here!</h2>
                                                    <form onSubmit={addReview}>
                                                        <TextareaAutosize
                                                            onChange={(e) => setReview(e.target.value)}
                                                            value={review}
                                                            aria-label="minimum height"
                                                            minRows={3}
                                                            placeholder="Add a comment..."
                                                            style={{ width: 500, padding: "5px" }}
                                                        />
                                                        <Box sx={{ pt: 1 }}>
                                                            <Button type='submit' variant='contained'>Comment</Button>
                                                        </Box>
                                                    </form>
                                                </Box>
                                            </>
                                            : <>
                                                <Link to='/login'> Log In to add a review</Link>
                                            </>
                                    }


                                </CardContent>

                            </Card>

                        </>
                }
            </Box>
            <Footer />
        </>
    );
}

export default SingleMovie;