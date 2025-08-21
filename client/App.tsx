import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProducts from './pages/AddProducts';
import GeneratePDF from './pages/GeneratePDF';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/products" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/products" />} />
      <Route path="/products" element={isAuthenticated ? <AddProducts /> : <Navigate to="/login" />} />
      <Route path="/AddProducts" element={isAuthenticated ? <AddProducts /> : <Navigate to="/login" />} />
      <Route path="/generate-pdf" element={isAuthenticated ? <GeneratePDF /> : <Navigate to="/login" />} />
      <Route path="/GeneratePDF" element={isAuthenticated ? <GeneratePDF /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-900">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;


// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./store";
// import { useAppSelector } from "./store/hooks";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AddProducts from "./pages/AddProducts";
// import GeneratePDF from "./pages/GeneratePDF";
// import NotFound from "./pages/NotFound";

// function AppRoutes() {
//   const { isAuthenticated } = useAppSelector((state) => state.auth);

//   return (
//     <Routes>
//       {/* Default route → Login */}
//       <Route
//         path="/"
//         element={!isAuthenticated ? <Login /> : <Navigate to="/products" />}
//       />

//       {/* Auth routes */}
//       <Route
//         path="/login"
//         element={!isAuthenticated ? <Login /> : <Navigate to="/products" />}
//       />
//       <Route
//         path="/register"
//         element={!isAuthenticated ? <Register /> : <Navigate to="/login" />}
//       />

//       {/* Protected routes */}
//       <Route
//         path="/products"
//         element={isAuthenticated ? <AddProducts /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/generate-pdf"
//         element={isAuthenticated ? <GeneratePDF /> : <Navigate to="/login" />}
//       />

//       {/* Catch all */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <div className="min-h-screen bg-slate-900">
//           <AppRoutes />
//         </div>
//       </BrowserRouter>
//     </Provider>
//   );
// }

// export default App;
