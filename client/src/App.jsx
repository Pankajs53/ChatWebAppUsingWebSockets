import {BrowserRouter , Routes, Route} from "react-router-dom"
import { Suspense, lazy } from "react"
import ProtectedRoute from "./components/auth/ProtectedRoute"


// GOOD(DYNAMIC) IMPORT pages will be needed when needed
const Home = lazy(()=> import("./pages/Home"))
const Login = lazy(()=> import("./pages/Login"))
const Chat = lazy(()=> import("./pages/Chat"))
const Groups = lazy(()=> import("./pages/Groups"))
const NotFound = lazy( () => import("./pages/NotFound")  )
const LayoutLoader = lazy(()=>import("./components/layout/Loader"))

const AdminLogin = lazy(()=>import("./pages/admin/AdminLogin"))
const DashBoard = lazy(()=>import("./pages/admin/DashBaord"))
const MessageManagment = lazy(()=>import("./pages/admin/MessageManagment"))
const ChatMangement = lazy(()=>import("./pages/admin/ChatMangement"))
const UserMangment = lazy(()=>import("./pages/admin/UserManagment"))

let user=true;

function App() {
 
  return (
    
      <BrowserRouter>
        <Suspense fallback={<LayoutLoader/>}>
          <Routes>
          <Route element={<ProtectedRoute user={user}/>}>
              <Route path="/" element={<Home/>}></Route>  
              <Route path="/chat/:chatId" element={<Chat/>}></Route>  
              <Route path="/groups" element={<Groups/>}></Route> 
          </Route>
            
            <Route path="/login" element={<ProtectedRoute user={!user} redirect="/">
                <Login/>
              </ProtectedRoute>}>
            </Route> 

            <Route path="/admin" element={<AdminLogin/>} />
            <Route path="/admin/dashboard" element={<DashBoard/>}></Route>
            <Route path="/admin/users" element={<UserMangment/>}></Route>
            <Route path="/admin/chats" element={<ChatMangement/>}></Route>
            <Route path="/admin/messages" element={<MessageManagment/>} ></Route>
            

            <Route path="*" element={<NotFound/>}>
              
            </Route>
          </Routes>  
          
        </Suspense>
        
        
      </BrowserRouter>
    
  )
}

export default App
