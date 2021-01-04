import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Container from '@material-ui/core/Container';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';

import { Loading } from './Loading';
import { tabs } from '../constants/tabs';
import Action from '../constants/action';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  delegator_container: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  tab: {
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
      '& svg': {
        fill: theme.palette.common.white,
      },
    }
  },
  active_tab: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  active_icon: {
    fill: theme.palette.common.white,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    height: `calc(100% - 64px)`,
    overflowY: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export const PrivateWrapper = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { loading: walletLoading } = useSelector(state => state.wallet);
  const { loading: userLoading } = useSelector(state => state.user);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: Action.USER_LOAD });
  }, []);

  const getPageTitle = (pathname) => {
    const page = pathname.toString().split('/')[1];
    switch (page) {

      case 'wallet':
        setTitle(`Wallet: ${pathname.toString().split('/')[2]}`);
        break;
      case 'new':
        setTitle('Add new wallet');
        break;
      case 'profile':
        setTitle('Profile');
        break;
      case 'list':
      default:
        setTitle('List of wallets');
        break;
    }
  };

  useEffect(() => {
    getPageTitle(location.pathname);
  }, [location]);

  let loadingText = '';
  if (userLoading) loadingText = 'Load user data';
  if (walletLoading) loadingText = 'Load wallet list';

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  const handleRouteTo = (path) => history.push(path);

  return (
    <div className={classes.delegator_container}>
      <AppBar className={`${classes.appBar} ${open && classes.appBarShift}`}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            className={`${classes.menuButton} ${open && classes.menuButtonHidden}`}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color="inherit"
            component="h1"
            variant="h6"
            noWrap
            className={classes.title}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: `${classes.drawerPaper} ${!open && classes.drawerPaperClose}`
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {
            tabs.map(({ key, path, Icon, title }) => (
              <ListItem
                key={key}
                button
                classes={{ button: `${classes.tab} ${location.pathname.match(path) && classes.active_tab}` }}
                onClick={() => handleRouteTo(path)}
              >
                <ListItemIcon>
                  <Icon classes={{ root: location.pathname.match(path) && classes.active_icon }} />
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            ))
          }
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {
            (userLoading || walletLoading) ? <Loading text={loadingText} /> : children
          }
        </Container>
      </main>
    </div>
  );
}
