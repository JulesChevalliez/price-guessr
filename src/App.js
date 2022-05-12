import logo from './logo.svg';
import './App.css';
import {Router, Route, Outlet, ReactLocation} from "@tanstack/react-location";
import Home from './Pages/Home';
import Product from './Pages/Product';
import ProductList from './Pages/ProductsList';


const routes:Route[] = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "product",
    children: [
      {
        path: "/",
        element: <Product />
      },
      {
        path: ":id",
        element: <Product />
      }
    ]
  },
  {
    path: "products-list",
    element: <ProductList />
  }
]

const location = new ReactLocation();

function App() {
  return (
    <Router routes={routes} location={location}>
      <div className="App">
        <Outlet />
      </div>
    </Router>
  );
}

export default App;
