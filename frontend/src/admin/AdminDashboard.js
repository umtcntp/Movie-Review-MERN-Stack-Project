import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment'
import axios from 'axios'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';


const AdminDashboard = () => {

    const [movies, setMovies] = useState([]);

    const displayMovie = async () => {
        try {
            const { data } = await axios.get('/api/movies/show');
            setMovies(data.movies);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        displayMovie();
    }, [])


    //delete post by Id
    const deleteMovieById = async (e, id) => {
        // console.log(id)
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const { data } = await axios.delete(`/api/delete/movie/${id}`);
                if (data.success === true) {
                    toast.success(data.message);
                    displayMovie();
                }
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        }
    }



    const columns = [

        {
            field: '_id',
            headerName: 'Movie ID',
            width: 150,
            editable: true,
        },
        {
            field: 'movieName',
            headerName: 'Movie title',
            width: 150,
        },

        {
            field: 'image',
            headerName: 'Image',
            width: 150,
            renderCell: (params) => (
                <img width="40%" src={params.row.image.url} />
            )

        },
        {
            field: 'likes',
            headerName: 'Likes',
            width: 150,
            renderCell: (params) => (
                params.row.likes.length
            )
        },
        {
            field: 'reviews',
            headerName: 'Reviews',
            width: 150,
            renderCell: (params) => (
                params.row.reviews.length
            )
        },
        {
            field: 'addedBy',
            headerName: 'Added by',
            width: 150,
            valueGetter: (data) => data.row.addedBy.name
        },
        {
            field: 'createdAt',
            headerName: 'Create At',
            width: 150,
            renderCell: (params) => (
                moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS')
            )
        },

        {
            field: "Actions",
            width: 100,
            renderCell: (value) => (
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "170px" }}>
                    <Link to={`/admin/movie/edit/${value.row._id}`}>
                        <IconButton aria-label="edit" >
                            <EditIcon sx={{ color: '#1976d2' }} />
                        </IconButton>
                    </Link>
                    <IconButton aria-label="delete" onClick={(e) => deleteMovieById(e, value.row._id)} >
                        <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>

                </Box>
            )
        }
    ];


    return (
        <Box >

            <Typography variant="h4" sx={{ color: "black", pb: 3 }}>
                Posts
            </Typography>
            <Box sx={{ pb: 2, display: "flex", justifyContent: "right" }}>
                <Button variant='contained' color="success" startIcon={<AddIcon />}><Link style={{ color: 'white', textDecoration: 'none' }} to='/admin/post/create'>Create Movie</Link> </Button>
            </Box>
            <Paper sx={{ bgcolor: "white" }} >

                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row._id}
                        sx={{

                            '& .MuiTablePagination-displayedRows': {
                                color: 'black',
                            },
                            color: 'black',
                            [`& .${gridClasses.row}`]: {
                                bgcolor: "white"
                            },

                        }}
                        rows={movies}
                        columns={columns}
                        pageSize={3}
                        rowsPerPageOptions={[3]}
                        checkboxSelection
                    />
                </Box>
            </Paper>

        </Box>
    )
}

export default AdminDashboard