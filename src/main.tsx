import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'

import Weather from './views/Weather.tsx'
import ToDo from './views/ToDo.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Weather />,
  },
  {
    path: "/to-do",
    element: <ToDo />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Header />
    <RouterProvider router={router} />
    <Footer />
  </>,
)
