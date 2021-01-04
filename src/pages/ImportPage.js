import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';
import Action from '../constants/action';
import { cryptoType as cType } from '../constants/cryptoType';
import { useShowSnackbar } from '../utils/helper.wallet';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    width: '50%',
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: '100%',
  },
  button: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  grey: {
    color: theme.palette.grey['500'],
  },
}));

export const ImportPage = () => {
  const classes = useStyles();
  const { new: newWallet } = useSelector(state => state.wallet);
  const { type, loading, error } = newWallet;
  const [privateKey, changePrivateKey] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { showSuccess, showError } = useShowSnackbar();

  const handleChangePrivateKey = ({ target: { value } }) => {
    // update local state
    changePrivateKey(value);

    // get address and validate
    dispatch({ type: Action.WALLET_IMPORT, prKey: value });
  };

  const handleCheckImportWallet = async () => {
    await dispatch({
      type: Action.WALLET_CHECK_IMPORTED,
      successCallback: ({ address, isActivated }) => {
        showSuccess({ text: 'Wallet successfully imported' });
        history.push(isActivated ? `/wallet/${address}` : '/import/activate');
      },
      errorCallback: () => showError({ text: 'Something went wrong during wallet importing' }),
    });
  };

  const handleChangeType = ({ target: { value } }) => {
    changePrivateKey('');
    dispatch({ type: Action.WALLET_NEW_CHANGE_TYPE, value });
  };

  return (
    <div className={classes.card}>
        <Typography component="h1" variant="subtitle1" className={classes.title}>Import Wallet</Typography>

        <Typography component="span" variant="subtitle2" className={classes.title}>Select Crypto type for importing</Typography>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Crypto type</InputLabel>
          <Select
            label="Choose crypto type"
            value={type}
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'Without label' }}
            onChange={handleChangeType}
          >
            <MenuItem value={cType.TRON.value}>{cType.TRON.name}</MenuItem>
            <MenuItem value={cType.ERC20.value}>{cType.ERC20.name}</MenuItem>
            <MenuItem value={cType.BTC.value}>{cType.BTC.name}</MenuItem>
          </Select>
        </FormControl>

        <Typography component="span" variant="subtitle2" className={`${classes.title} ${!type ? classes.grey : ''}`}>Input private key of the wallet</Typography>
        <FormControl className={classes.formControl}>
          <TextField
            error={!!error}
            variant="outlined"
            label="Private key"
            type="password"
            value={privateKey}
            disabled={!type || loading}
            autoComplete="new-password"
            helperText={error}
            onChange={handleChangePrivateKey}
          />
        </FormControl>

        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          disabled={!type || !privateKey || privateKey === '' || loading || !!error}
          onClick={handleCheckImportWallet}
        >
          Import
          {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
        </Button>
      </div>
  );
}
