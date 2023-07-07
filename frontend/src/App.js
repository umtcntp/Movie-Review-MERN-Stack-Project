import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { Provider } from 'react-redux';
import store from './redux/store';
import LogIn from './pages/LogIn'
import UserRoute from './components/UserRoute';
import AdminDashboard from './admin/AdminDashboard';
import CreateMovie from './admin/CreateMovie';
import EditMovie from './admin/EditMovie';
import AdminRoute from './components/AdminRoute';
import Layout from './admin/global/Layout';
import UserDashboard from './user/UserDashboard'
import SingleMovie from './pages/SingleMovie';
import Register from './pages/Register';


//HOC
const AdminDashboardHOC = Layout(AdminDashboard);
const CreateMovieHOC = Layout(CreateMovie);
const EditPostHOC = Layout(EditMovie);
const UserDashboardHOC = Layout(UserDashboard);

const App = () => {
  return (
    <>
      <ToastContainer />
        <Provider store={store}>
          <ProSidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/login' element={<LogIn/>} />
                <Route path='/register' element={<Register/>}></Route>
                <Route path='/post/:id' element={<SingleMovie />} />
                <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboardHOC/></AdminRoute>} />
                <Route path='/admin/movie/create' element={<AdminRoute><CreateMovieHOC/></AdminRoute>} />
                <Route path='/admin/movie/edit/:id' element={<AdminRoute><EditPostHOC/></AdminRoute>} />
                <Route path='/user/dashboard' element={<UserRoute><UserDashboardHOC /></UserRoute>} />
                <Route path='*' element={<NotFound/>} />
              </Routes>
            </BrowserRouter>
          </ProSidebarProvider>
        </Provider>
    </>
  )
}

export default App