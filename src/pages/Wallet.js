import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  wallet_container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const Wallet = () => {
  const classes = useStyles();

  return (
    <div className={classes.wallet_container}>
    </div>
  );
};
