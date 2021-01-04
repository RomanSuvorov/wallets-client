import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';

import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FileCopy, Save } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { WalletInfoPDF } from '../components/WalletInfoPDF';
import Action from '../constants/action';
import { useCopy, useShowSnackbar, decryptKey } from '../utils/helper.wallet';

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
  inputRoot: {
    width: '100%',
  },
  input: {
    cursor: 'default',
  },
  copyButton: {
    transition: theme.transitions.create(['color'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  btnBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
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
  downloadButton: {
    marginBottom: theme.spacing(2),
    position: 'relative',
  },
  downloadButtonInner: {

  },
  PDFDownloadLink: {
    textDecoration: 'none',
    color: 'inherit',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export const ActivatePage = () => {
  const classes = useStyles();
  const { new: newWallet } = useSelector(state => state.wallet);
  const { firstName, lastName } = useSelector(state => state.user);
  const { loading, error, isActivated, isGenerated, name, address, privateKey } = newWallet;
  const { copiedValue, copyHandler } = useCopy();
  const dispatch = useDispatch();
  const history = useHistory();
  const { showSuccess, showError } = useShowSnackbar();
  const decryptedPrivateKey = decryptKey({ key: privateKey, data: address });

  if (!isGenerated || !address) {
    return <Redirect to="/generate/new" />
  }

  const handleCopy = async (value) => await copyHandler(value);

  const handleBack = () => history.goBack();

  const handleActivateWallet = async () => {
    await dispatch({
      type: Action.WALLET_NEW_ACTIVATION,
      successCallback: () => showSuccess({ text: 'Wallet successfully activated' }),
      errorCallback: () => showError({ text: 'Something went wrong during wallet activation' }),
    });
  };

  const handleGoToList = () => history.push('/list');

  const handleGoToWallet = () => history.push(`/wallet/${address}`);

  return (
    <Fragment>
      {isActivated ? (
        <div className={classes.card}>
          <Typography component={"h1"} variant={"subtitle1"} className={classes.title}>Wallet &#9899&#9899${name}&#9899&#9899 activated</Typography>

          <Typography component={"h1"} variant={"subtitle2"} className={classes.title}>Your address</Typography>
          <FormControl className={classes.formControl}>
            <OutlinedInput
              readOnly
              classes={{
                root: classes.inputRoot,
                input: classes.input
              }}
              type="text"
              value={address}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className={classes.copyButton}
                    edge="end"
                    color={copiedValue === address ? 'primary' : 'default'}
                    onClick={() => handleCopy(address)}
                  >
                    <FileCopy />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Typography component={"h1"} variant={"subtitle2"} className={classes.title}>Your private key</Typography>
          <FormControl className={classes.formControl}>
            <OutlinedInput
              readOnly
              classes={{
                root: classes.inputRoot,
                input: classes.input
              }}
              type="text"
              value={decryptKey({ key: privateKey, data: address })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className={classes.copyButton}
                    edge="end"
                    color={copiedValue === decryptedPrivateKey ? 'primary' : 'default'}
                    onClick={() => handleCopy(decryptedPrivateKey)}
                  >
                    <FileCopy />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Typography component={"h1"} variant={"subtitle1"} className={classes.title}>Please download PDF with info about this wallet. It will help you to secure your activated wallet</Typography>
          <Button
            className={`${classes.button} ${classes.downloadButton}`}
            variant={"contained"}
            size={"large"}
            color={"secondary"}
            startIcon={<Save />}
          >
            Download
            <PDFDownloadLink
              className={classes.PDFDownloadLink}
              document={
                <WalletInfoPDF
                  firstName={firstName}
                  lastName={lastName}
                  name={name}
                  address={address}
                  privateKey={decryptedPrivateKey}
                />
              }
              fileName={`Wallet ${name}.pdf`}
            >
              {({ blob, url, loading: downloadLoading, error }) => (
                downloadLoading && <CircularProgress size={24} className={classes.buttonProgress}/>
              )}
            </PDFDownloadLink>
          </Button>

          <div className={classes.btnBox}>
            <Button
              variant={"contained"}
              size={"medium"}
              onClick={handleGoToList}
            >
              To List
            </Button>
            <Button
              className={classes.button}
              variant={"contained"}
              color={"primary"}
              size={"medium"}
              onClick={handleGoToWallet}
            >
              To Wallet
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.card}>
          <Typography component={"h1"} variant={"subtitle1"} className={classes.title}>Activate your generated wallet</Typography>

          <Typography component={"span"} variant={"subtitle2"} className={classes.title}>Address of generated wallet</Typography>
          <FormControl className={classes.formControl}>
            <OutlinedInput
              readOnly
              classes={{
                root: classes.inputRoot,
                input: classes.input
              }}
              type={"text"}
              value={address}
              endAdornment={
                <InputAdornment position={"end"}>
                  <IconButton
                    className={classes.copyButton}
                    edge={"end"}
                    color={copiedValue === address ? 'primary' : 'default'}
                    onClick={() => handleCopy(address)}
                  >
                    <FileCopy />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <div className={classes.btnBox}>
            <Button
              variant={"contained"}
              size={"medium"}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              disabled={loading}
              className={classes.button}
              variant={"contained"}
              color={"primary"}
              size={"medium"}
              onClick={handleActivateWallet}
            >
              Activate
              {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
            </Button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
