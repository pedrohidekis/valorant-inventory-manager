import { useEffect, useState, useRef } from "react";

//utilities
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Switch, Route, HashRouter, Redirect } from "react-router-dom";
import socket from "./services/Socket";
import { Config, setVersion} from "./services/ClientConfig"


//pages
import CollectionHome from "./pages/CollectionHome"
import BuddiesHome from "./pages/BuddiesHome"
import Onboarding from "./pages/Onboarding"
import ConnectionFailed from "./components/misc/ConnectionFailed"

//components
import WebsocketHandshake from "./components/misc/WebsocketHandshake";

const mainTheme = createTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#fa7581",
        },
        secondary: {
            main: "#454545",
        },
    },
    typography: {
        fontFamily: [
            'Chivo',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    overrides: {
        MuiCssBaseline: {
            // this is fine for now but perhaps make the background transparent in the future
            "@global": {
                body: {
                    "&::-webkit-scrollbar": {
                        width: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                        boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "darkgrey",
                        outline: `1px solid slategrey`,
                    },
                },
            },
        },
    },
})


function App(props) {
    const [isLoading, setLoading] = useState(true);
    const [showLoad, setShowLoad] = useState(true);

    const [connected, setConnected] = useState(false);

    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    const [ready, setReady] = useState(false);

    const [errorPage, setErrorPage] = useState(null);

    // WEBSOCKETS MAKE ME WANT TO KILL MYSELF (9/6/2021)
    //----------------------------------------------------------------------------------

    //connect socket -> check for onboarding -> set ready true

    useEffect(() => {
        connectSocket()
        socket.subscribe("onclose", disconnect, false, "onclose")
    }, [])

    useEffect(() => {
        if (connected && !ready) {
            getStates()
        }
    }, [connected])

    function stopLoading(success) {
        setShowLoad(false)
        setTimeout(() => {
            setLoading(false);
        }, 300)
    }

    async function connectSocket() {
        setLoading(true);
        setShowLoad(true);
        setReady(false);
        setConnected(false);
        setErrorPage(null);

        socket.connect()
            .then((response) => {
                console.log("done")
                setConnected(true);
                stopLoading();
            })
            .catch(() => {
                console.log("caught something")
                setConnected(false);
                stopLoading()
                setErrorPage(<ConnectionFailed retry={connectSocket} />)
            })

    }

    function getStates() {
        function onboardingCallback(response) {
            console.log(response)
            console.log(`onboarded: ${response}`)
            if (response === false) {
                setOnboardingCompleted(false);
            } else {
                setOnboardingCompleted(true);
            }
            setReady(true);
        }
        socket.request({ "request": "get_onboarding_state" }, onboardingCallback)

        function serverVersionCallback(response) {
            console.log(response)
            setVersion(response)
        }
        socket.request({ "request": "get_server_version" }, serverVersionCallback)
    }


    function startupChecks() {
        if (isLoading) {
            return (<WebsocketHandshake open={showLoad} />)
        }
    }

    function disconnect() {
        console.log("disconnected")
        setConnected(false);
        setReady(false)
        setErrorPage(<ConnectionFailed retry={connectSocket} />)
    }

    return (
        <ThemeProvider theme={mainTheme}>
            <CssBaseline />
            {/* <AnimatedCursor
                color="255,255,255"
                innerSize={12}
                outerSize={18}
                outerScale={1.5}
                trailingSpeed={4}
            /> */}

            {errorPage}

            {startupChecks()}

            {ready ?
                <HashRouter basename="/">
                    <Route exact path="/">
                        {onboardingCompleted ? <Redirect to="/collection" /> : <Redirect to="/onboarding" />}
                    </Route>
                    <Route path="/collection">
                        <CollectionHome />
                    </Route>
                    <Route path="/onboarding">
                        <Onboarding />
                    </Route>
                    <Route path="/buddies">
                        <BuddiesHome />
                    </Route>
                </HashRouter>
                : null}


        </ThemeProvider>
    );
}


export default App;