import { FileOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, IconButton, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import HighLightText from 'components/HighLightText';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import guidelines from 'themes/styles';

const useStyles = makeStyles({
  MuiTableCell: {
    border: '0px solid #000 !important',
    borderLeft: '0px !important',
    borderBottom: 'none !important'
  }
});

const AppTable = ({
  columns = [],
  rows = [],
  onPressTable,
  rowsPerPageOptions = [5, 10, 25],
  initialRowsPerPage = 5,
  enablePagination = true,
  handleClickAction
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  const { palette } = useTheme();
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const renderColumnContent = (column, row) => {
    if (!column || !row) return null;
    if (column.document) {
      return row[column.id]?.length ? (
        row[column.id]?.map((item, index) => (
          <ListItemButton download={item} sx={{ gap: 2 }} onClick={(event) => window.open(item, '_blank')}>
            <ListItemIcon>
              <FileOutlined style={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItemButton>
        ))
      ) : (
        <ListItemButton sx={{ gap: 2 }}>
          <ListItemIcon>
            <FileOutlined style={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary={'No Document or file'} />
        </ListItemButton>
      );
    }
    if (column.isLink) {
      return (
        <Link
          component="div"
          variant="body2"
          onClick={() => {
            window.location.href = row[column.id];
          }}
          sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        >
          {row[column.id] || 'N/A'}
        </Link>
      );
    }

    if (column.isAvatar) {
      return (
        <Avatar
          sx={{
            width: 100,
            height: 100,
            objectFit: 'contain'
          }}
          src={row[column.id]}
          sizes="md"
        />
      );
    }

    return <HighLightText text={row[column.id]} highlight={column.hightLightText} />;
  };
  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          {/* Table Header Body is here display Data  */}
          <TableBody>
            <TableRow
              sx={{
                '&:hover': {
                  cursor: 'pointer'
                }
              }}
            >
              {columns.map((column, index) => {
                return (
                  <TableCell
                    sx={{
                      backgroundColor: palette.primary.light,
                      color: palette.common.white,
                      fontSize: guidelines.fontSize.rem1,
                      textTransform: 'none',
                      fontWeight: '600'
                    }}
                    key={index + ''}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth || 100 }}
                  >
                    {column?.label}
                  </TableCell>
                );
              })}
              <TableCell
                key={'action'}
                sx={{
                  backgroundColor: palette.primary.light,
                  color: palette.common.white,
                  fontSize: guidelines.fontSize.rem1,
                  textTransform: 'none',
                  fontWeight: '600'

                  // borderWidth: '10px'
                }}
                align={'left'}
                style={{ minWidth: 70 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableBody>

          {/* Table Row Body is here display Data  */}
          <TableBody>
            {rows?.length > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                    {columns.map((column, index) => (
                      <Fragment key={index}>
                        <TableCell
                          // onClick={() => onPressTable(row)}
                          key={index + ''}
                          align={column.align || 'left'}
                          sx={{
                            textOverflow: 'ellipsis',
                            color: column?.id == 'status' && row?.color
                          }}
                        >
                          {renderColumnContent(column, row)}
                        </TableCell>
                      </Fragment>
                    ))}
                    <TableCell
                      align={'left'}
                      sx={{
                        textOverflow: 'ellipsis',
                        paddingLeft: '20px'
                      }}
                    >
                      <IconButton onClick={(e) => handleClickAction(e, row)} color="primary" aria-label="actions">
                        <MoreOutlined
                          style={{
                            fontSize: '20px'
                          }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      {enablePagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

AppTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      minWidth: PropTypes.number
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  initialRowsPerPage: PropTypes.number,
  enablePagination: PropTypes.bool
};

export default AppTable;
