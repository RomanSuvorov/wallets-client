import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import TelegramIcon from '@material-ui/icons/Telegram';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  logInBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

export const AuthPage = () => {
  const { sessionID } = useSelector(state => state.app);
  const classes = useStyles();

  const handleLogIn = () => {
    const link = document.createElement('a');
    link.hidden = true;
    link.target = "_blank";
    link.href = `https://t.me/ratuta12_bot?start=${sessionID}`;
    link.rel = "noopener noreferrer"
    document.body.appendChild(link);

    link.click();
  };

  return (
    <div className={classes.logInBox}>
      <Typography className={classes.title} component="h1" variant="h5">
        Public Page
      </Typography>

      <Button
        variant="contained"
        color="primary"
        endIcon={<TelegramIcon />}
        size="large"
        onClick={handleLogIn}
      >
        Log in via Telegram
      </Button>
    </div>
  );
}
