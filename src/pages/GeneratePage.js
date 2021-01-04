import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';
import Action from '../constants/action';
import { cryptoType as cType } from '../constants/cryptoType';
import { useShowSnackbar } from '../utils/helper.wallet';

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
  selectEmpty: {

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
}));

export const GeneratePage = () => {
  const classes = useStyles();
  const { new: newWallet } = useSelector(state => state.wallet);
  const { name, type, loading, error } = newWallet;
  const dispatch = useDispatch();
  const history = useHistory();
  const { showSuccess, showError } = useShowSnackbar();

  const handleGenerateNewWallet = async () => {
    await dispatch({
      type: Action.WALLET_NEW_GENERATION,
      successCallback: () => {
        showSuccess({ text: 'Wallet successfully generated' });
        history.push('/generate/activate');
      },
      errorCallback: () => showError({ text: 'Something went wrong during wallet generation' }),
    });
  };

  return (
    <div className={classes.card}>
        <Typography component="h1" variant="subtitle1" className={classes.title}>Generate New Wallet</Typography>
        <Typography component="span" variant="subtitle2" className={classes.title}>Input name of new wallet</Typography>
        <FormControl className={classes.formControl}>
          <TextField
            autoFocus
            variant="outlined"
            label="Name of wallet"
            value={name}
            onChange={e => dispatch({ type: Action.WALLET_NEW_CHANGE_NAME, value: e.target.value })}
          />
        </FormControl>

        <Typography component="span" variant="subtitle2" className={classes.title}>Choose crypto type</Typography>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Crypto type</InputLabel>
          <Select
            label="Choose crypto type"
            value={type}
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'Without label' }}
            onChange={e => dispatch({ type: Action.WALLET_NEW_CHANGE_TYPE, value: e.target.value })}
          >
            <MenuItem value={cType.TRON.value}>{cType.TRON.name}</MenuItem>
            <MenuItem value={cType.ERC20.value}>{cType.ERC20.name}</MenuItem>
            <MenuItem value={cType.BTC.value}>{cType.BTC.name}</MenuItem>
          </Select>
        </FormControl>

        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          disabled={!type || !name || name === '' || loading}
          onClick={handleGenerateNewWallet}
        >
          Generate
          {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
        </Button>
      </div>
  );
}
