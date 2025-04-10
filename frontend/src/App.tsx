import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Wrapper from "./pages/Wrapper";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Wrapper>
                <Main />
              </Wrapper>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/create"
            element={
              <Wrapper>
                <Create />
              </Wrapper>
            }
          />
          <Route
            path="/edit"
            element={
              <Wrapper>
                <Edit />
              </Wrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
