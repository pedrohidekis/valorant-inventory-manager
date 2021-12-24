import React, { useEffect } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grid, Grow, Typography, Toolbar, IconButton, Slide, Paper, Tooltip } from '@material-ui/core'

//icons
import { Settings, Shuffle, Autorenew, SportsEsports } from '@material-ui/icons';

import socket from "../../services/Socket";
import { Config, ServerVersion } from "../../services/ClientConfig"


const useStyles = makeStyles((theme) => ({

    statusBar: {
        alignSelf: "flex-end",
        justifySelf: "flex-end",
        width: "100%",
        padding: "10px",
        display: "flex",
        flexDirection: "row",
    },

    versionText: {
        alignSelf: "flex-end",
        width: "50%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        flexGrow: 1,
        opacity: .5,
    }

}));


function Footer(props) {

    const classes = useStyles();
    const theme = useTheme();


    return (
        <>
            <div className={classes.statusBar}>
                <div className={classes.versionText}>
                    <Typography variant="subtitle2">
                        client v{Config.VERSION} / server v{ServerVersion}
                    </Typography>
                </div>

            </div>
        </>
    )
}

export default Footer