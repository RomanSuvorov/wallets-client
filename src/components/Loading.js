import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  loading_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
}));

export const Loading = ({ text = '' }) => {
  const classes = useStyles();

  return (
    <div className={classes.loading_container}>
      <CircularProgress />
      {text && (
        <div className={classes.text_container}>
          <Typography variant='h6' component='h1'>{text}</Typography>
        </div>
      )}
    </div>
  );
};
