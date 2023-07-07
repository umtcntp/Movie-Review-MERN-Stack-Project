import { Box, Button, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import * as yup from 'yup';
import Dropzone from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules } from '../components/moduleToolBar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



const validationSchema = yup.object({
    movieName: yup
        .string('Add a movie title')
        .min(4, 'text content should havea minimum of 4 characters ')
        .required('Movie title is required'),
    description: yup
        .string('Add text content')
        .min(10, 'text content should havea minimum of 10 characters ')
        .required('text content is required'),
});



const EditMovie = () => {

    const { id } = useParams();
    const [movieName, setMovieName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const navigate = useNavigate();

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue
    } = useFormik({
        initialValues: {
          movieName,
          description,
            image: ''
        },

        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values, actions) => {
            updateMovie(values);
            //alert(JSON.stringify(values, null, 2));
            actions.resetForm();
        },
    });


    //show movie by Id
    const singleMovieById = async () => {
        // console.log(id)
        try {
            const { data } = await axios.get(`/api/movie/${id}`);
            setMovieName(data.movie.movieName);
            setDescription(data.movie.description);
            setImagePreview(data.movie.image.url);
            console.log('single movie admin', data.movie)

        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    useEffect(() => {
        singleMovieById()
    }, [])

    const updateMovie = async (values) => {
        try {
            const { data } = await axios.put(`/api/update/movie/${id}`, values);
            if (data.success === true) {
                toast.success('movie updated');
                navigate('/admin/dashboard')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    }


    return (
        <>
            <Box sx={{ bgcolor: "white", padding: "20px 200px" }}>
                <Typography variant='h5' sx={{ pb: 4 }}> Edit movie  </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField sx={{ mb: 3 }}
                        fullWidth
                        id="movieName"
                        label="Movie title"
                        name='movieName'
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Movie title"
                        value={values.movieName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.movieName && Boolean(errors.movieName)}
                        helperText={touched.movieName && errors.movieName}
                    />


                    <Box sx={{ mb: 3 }}>
                        <ReactQuill
                            theme="snow"
                            placeholder={'Write the movie description...'}
                            modules={modules}
                            value={values.description}
                            onChange={(e) => setFieldValue('description', e)}
                        />
                        <Box component='span' sx={{ color: '#d32f2f', fontSize: "12px", pl: 2 }}>{touched.description && errors.description}</Box>
                    </Box>

                    <Box border='2px dashed blue' sx={{ p: 1 }}>
                        <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            //maxFiles={3}
                            onDrop={(acceptedFiles) =>
                                acceptedFiles.map((file, index) => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = () => {
                                        setFieldValue('image', reader.result)
                                    }
                                })
                            }
                        >
                            {({ getRootProps, getInputProps, isDragActive }) => (
                                <Box
                                    {...getRootProps()}

                                    p="1rem"
                                    sx={{ "&:hover": { cursor: "pointer" }, bgcolor: isDragActive ? "#cceffc" : "#fafafa" }}
                                >
                                    <input name="image" {...getInputProps()} />
                                    {
                                        isDragActive ? (
                                            <>
                                                <p style={{ textAlign: "center" }}><CloudUploadIcon sx={{ color: "primary.main", mr: 2 }} /></p>
                                                <p style={{ textAlign: "center", fontSize: "12px" }}> Drop here!</p>

                                            </>
                                        ) :

                                            values.image === null ?

                                                <>
                                                    <p style={{ textAlign: "center" }}><CloudUploadIcon sx={{ color: "primary.main", mr: 2 }} /></p>
                                                    <p style={{ textAlign: "center", fontSize: "12px" }}>Drag and Drop image here or click to choose</p>
                                                </> :



                                                <>
                                                    <Box sx={{ display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>

                                                        <Box ><img style={{ maxWidth: "100px" }} src={values.image === '' ? imagePreview : values.image} alt="" /></Box>
                                                    </Box>
                                                </>
                                    }
                                </Box>
                            )}
                        </Dropzone>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        elevation={0}
                        sx={{ mt: 3, p: 1, mb: 2, borderRadius: "25px", }}
                    // disabled={loading}
                    >
                        Update movie
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default EditMovie