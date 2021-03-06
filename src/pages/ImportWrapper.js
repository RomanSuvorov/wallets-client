import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import { ImportRoute } from '../routes';
import Action from '../constants/action';

const useStyles = makeStyles((theme) => ({
  generate_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const ImportWrapper = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: Action.WALLET_NEW_PREPARE });
  }, []);

  return (
    <div className={classes.generate_container}>
      <ImportRoute />
    </div>
  );
};
