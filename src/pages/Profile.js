import React from 'react';
import { useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  profile_container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  dataKeyCell: {
    fontWeight: 'bold',
  }
}));

export const Profile = () => {
  const classes = useStyles();
  const { firstName, lastName, username } = useSelector(state => state.user);

  const rows = [
    { key: 'First name:', value: firstName },
    { key: 'Last name:', value: lastName },
    { key: 'Username:', value: username },
  ];

  return (
    <div className={classes.addresses_container}>
      <Typography
        className={classes.title}
        component="h1"
        variant="h5"
      >
        Profile data
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.key}>
                <TableCell align="left">
                  <Typography
                    component="span"
                    className={classes.dataKeyCell}
                  >
                    {row.key}
                  </Typography>
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                >
                  <Typography>{row.value}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
