import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
import { Toaster } from "react-hot-toast"


function App() {

    return (
        <BrowserRouter>
            <Toaster />
            <AppRouter />
        </BrowserRouter>
    )
}

export default App
