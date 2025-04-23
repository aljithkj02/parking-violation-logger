import AppRouter from "./routes/AppRouter"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { store } from "./store"


function App() {

    return (
        <Provider store={store}>
            <Toaster />
            <AppRouter />
        </Provider>
    )
}

export default App
