import { withStyles } from 'material-ui/styles';
import TableCell from 'material-ui/Table/TableCell';

export const SmallCell = withStyles(() => ({
  body: {
    fontSize: '0.9em',
    height: '6px',
    paddingTop: '0',
    paddingLeft: '5px',
    paddingBottom: '0',
    paddingRight: '5px',
    lineHeight: '14px',
  },
}))(TableCell);

export const SmallCellR = withStyles(() => ({
  body: {
    fontSize: '0.9em',
    height: '6px',
    paddingTop: '0',
    paddingLeft: '5px',
    paddingBottom: '0',
    paddingRight: '5px',
    lineHeight: '14px',
    textAlign: 'right',
  },
}))(TableCell);
