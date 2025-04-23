import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { store } from "./store"


function App() {

    return (
        <BrowserRouter>
            <Provider store={store}>
                <Toaster />
                <AppRouter />
            </Provider>
        </BrowserRouter>
    )
}

export default App
