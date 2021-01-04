import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import { Loading } from '../components/Loading';
import { PublicRoute, PrivateRoute } from '../routes';
import Action from '../constants/action';

const useStyles = makeStyles((theme) => ({
  delegator_container: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export const Delegator = () => {
  const { loading, status, sessionID, error, isAuthenticated, checkingExistedUser } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: Action.CHECK_SERVER });
  }, [dispatch]);

  const Wrapper = ({ children }) => (
    <div className={classes.delegator_container}>
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );

  if (loading || checkingExistedUser) {
    let loadingText = '';
    if (loading) loadingText = 'Checking server';
    if (checkingExistedUser) loadingText = 'Checking login data of existed user';
    return (
      <Wrapper>
        <Loading text={loadingText} />
      </Wrapper>
    );
  }

  if (status !== 200 || !sessionID) {
    return (
      <Wrapper>
        <>
          Server sleeping now, sorry %(
          {error && (
            <div>{error.message}</div>
          )}
        </>
      </Wrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <Wrapper>
        <PublicRoute />
      </Wrapper>
    );
  }

  return (
    <PrivateRoute />
  );
};
