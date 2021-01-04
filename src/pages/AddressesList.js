import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ExpandMore, Forward, FileCopy } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useCopy } from '../utils/helper.wallet';

import { cryptoType } from '../constants/cryptoType';

const useStyles = makeStyles((theme) => ({
  addresses_container: {
    display: 'flex',
    flexDirection: 'column',
  },
  empty_container: {
    alignItems: 'center',
  },
  get_new: {
    textDecoration: 'none',
    color: theme.palette.common.white,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  accordion: {
    marginBottom: theme.spacing(2),
  },
  list: {
    display: 'block',
    width: '100%',
  },
  listAction: {
    marginRight: theme.spacing(-1),
  },
  listItemRoot: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  listItemName: {
    paddingLeft: theme.spacing(1),
  },
  inputRoot: {
    width: '100%',
  },
  input: {
    cursor: 'default',
  },
  btnBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
  },
  copyButton: {
    transition: theme.transitions.create(['color'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  empty_title: {
    color: theme.palette.common.black,
    textAlign: 'center',
  }
}));

export const AddressesList = () => {
  const { copiedValue, copyHandler } = useCopy();
  const { wallets } = useSelector(state => state.wallet);
  const { tron, erc20, btc } = wallets;
  const isEmptyList = !tron.length && !erc20.length && !btc.length;
  const classes = useStyles();
  const history = useHistory();

  if (isEmptyList) {
    return (
      <div className={`${classes.addresses_container} ${classes.empty_container}`}>
        <p className={classes.empty_title}>You have no any wallet yet. Press "Generate new Wallet" button for creating!</p>
        <div className={classes.btnBox}>
          <Button
            variant="contained"
            color="primary"
            size="large"
          >
            <Link className={classes.get_new} to="/generate/new">Generate new Wallet</Link>
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
          >
            <Link className={classes.get_new} to="/import/new">Import existed Wallet</Link>
          </Button>
        </div>
      </div>
    )
  }

  const goToWallet = address => history.push(`/wallet/${address}`);

  const handleCopyAddress = async (address) => await copyHandler(address);

  const getAccordionList = (array, title) => (
    <Accordion className={classes.accordion}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.list}>
          <List
            dense={false}
            disablePadding
          >
            {
              array.map(({ _id, name, address }) => (
                <ListItem
                  classes={{ root: classes.listItemRoot }}
                  key={_id}
                  disableGutters
                >
                  <Typography
                    className={classes.listItemName}
                    component="h1"
                    variant="subtitle2"
                  >
                    {name}
                  </Typography>
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
                          onClick={() => handleCopyAddress(address)}
                        >
                          <FileCopy />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <ListItemSecondaryAction className={classes.listAction}>
                    <IconButton edge="end" onClick={() => goToWallet(address)}>
                      <Forward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            }
          </List>
        </div>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div className={classes.addresses_container}>
      <Typography component="h1" variant="h4" className={classes.title}>Your addresses</Typography>
      {!!tron.length && getAccordionList(tron, cryptoType.TRON.name)}
      {!!erc20.length && getAccordionList(erc20, cryptoType.ERC20.name)}
      {!!btc.length && getAccordionList(btc, cryptoType.BTC.name)}
    </div>
  );
};
