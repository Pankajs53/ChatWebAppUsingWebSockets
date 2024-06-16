import axios from "axios";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { server } from "./constants/config";
import { userExists, userNotExists } from "./redux/reducers/auth";

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// GOOD(DYNAMIC) IMPORT pages will be needed when needed
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LayoutLoader = lazy(() => import("./components/layout/Loader"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const DashBoard = lazy(() => import("./pages/admin/DashBaord"));
const MessageManagment = lazy(() => import("./pages/admin/MessageManagment"));
const ChatMangement = lazy(() => import("./pages/admin/ChatMangement"));
const UserMangment = lazy(() => import("./pages/admin/UserManagment"));

function App() {
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("SERVER IS ->", server);
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((error) => dispatch(userNotExists()));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader/>}>
        <Routes>
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/chat/:chatId" element={<Chat />}></Route>
            <Route path="/groups" element={<Groups />}></Route>
          </Route>

          <Route
            path="/login"
            element={
              <ProtectedRoute user={!user} redirect="/">
                <Login />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<DashBoard />}></Route>
          <Route path="/admin/users" element={<UserMangment />}></Route>
          <Route path="/admin/chats" element={<ChatMangement />}></Route>
          <Route path="/admin/messages" element={<MessageManagment />}></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;
