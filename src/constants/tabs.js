import ListIcon from '@material-ui/icons/List';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

export const tabs = [
  {
    key: 'list',
    path: '/list',
    title: 'List of Addresses',
    Icon: ListIcon,
  },
  {
    key: 'generate',
    path: '/generate',
    title: 'Generate',
    Icon: AccountBalanceWalletIcon,
  },
  {
    key: 'import',
    path: '/import',
    title: 'Import',
    Icon: ImportExportIcon,
  },
  {
    key: 'profile',
    path: '/profile',
    title: 'Profile',
    Icon: AccountBoxIcon,
  },
];
