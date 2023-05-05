import { Dialoog, DialoogProvider } from 'dialoog';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import './styles.scss';
import { ClientProvider } from './components/ClientProvider.tsx';
import { Challenges } from './pages/Challenges.tsx';
import { Error } from './pages/Error.tsx';
import { Login } from './pages/Login.tsx';
import { Profile } from './pages/Profile.tsx';
import { Root } from './pages/Root.tsx';
import { Folders } from './pages/folders/Folders.tsx';
import { AuthProvider } from './states/authentication.ts';

const root = createRoot(document.getElementById('root')!);
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error/>,
    children: [{
      index: true,
      element: <Navigate to="/folders"/>
    }, {
      path: '/folders',
      children: [{
        index: true,
        element: <Folders/>
      }, {
        path: ':id',
        element: <Folders/>
      }]
    }, {
      path: '/challenges',
      element: <Challenges/>
    }, {
      path: '/profile',
      element: <Profile/>
    }]
  },
  {
    path: '/login',
    element: <Login/>,
    errorElement: <Error/>
  }
]);

root.render((
  <DialoogProvider>
    <AuthProvider>
      <ClientProvider>
        <RouterProvider router={router}/>
        <Dialoog/>
      </ClientProvider>
    </AuthProvider>
  </DialoogProvider>
));
