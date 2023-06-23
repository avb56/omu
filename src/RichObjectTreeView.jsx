import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ItemDialog from './ItemDialog';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ItemDialogContext = React.createContext();
const data = [
  {
    title: 'Parent',
    children: [
      {
        title: 'Child - 1',
      },
      {
        title: 'Child - 3',
        children: [
          {
            title: 'Child - 4',
            description: 'Child - 54',
          },
        ],
      },
    ],
  },
  {
    title: 'Child - 2',
    description: 'Child - 2',
  },
];

export default function RichObjectTreeView() {
  const [bItemDialogOpen, setItemDialogOpen] = React.useState(false);
  const [oItemDialogOptions, setItemDialogOptions] = React.useState({ node: {} });
  const [aTreeData, setTreeData] = React.useState(data);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function fDataEditor({ id, title, description }) {
    const aNewData = [ ...aTreeData ];
    const oNode = id.reduce((node, index) => node.children[index], { children: aNewData });
    // console.log(oEditData);
    oNode.title = title;
    oNode.description = description;
    setTreeData(aNewData);
  }

  return <ItemDialogContext.Provider value={{ setItemDialogOpen, setItemDialogOptions, setAnchorEl }}>
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {aTreeData.map((node, i) => renderTree(node, [i]))}
    </TreeView>
    <ItemDialog { ...{ bItemDialogOpen, setItemDialogOpen, oItemDialogOptions, fDataEditor }} />
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={ev => setItemDialogOpen(true)}>Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
      <MenuItem onClick={handleClose}>Logout</MenuItem>
    </Menu>
  </ItemDialogContext.Provider>
}

const renderTree = (nodes, id) => (
  <TreeItem
    key={id.join('/')} nodeId={id.join('/')}
    sx={{ '& .MuiTreeItem-content': { p: 0 } }}
    label={<LabelRow id={id} node={nodes} />}
  >
    {Array.isArray(nodes.children)
    ? nodes.children.map((node, i) => renderTree(node, id.concat(i)))
    : null}
  </TreeItem>
);

function LabelRow(props) {
  const handleRowClick = ev => console.log(ev.detail == 2);
  const { setItemDialogOpen, setItemDialogOptions, setAnchorEl } = React.useContext(ItemDialogContext);

  function fItemMenuOpen(ev) {
    ev.stopPropagation();
    setItemDialogOptions(props);
    setAnchorEl(ev.currentTarget);
    // console.log(props.id.join('/'));
  }

  function fItemDialogOpen() {
    setItemDialogOptions(props);
    setItemDialogOpen(true);
    // console.log(props.id.join('/'));
  }

  return <Grid
    container spacing={2}
    alignItems="center"
  > 
    <Grid xs
      onClick={ev => ev.detail == 2 && fItemDialogOpen()}
    >{props.node.title}</Grid>
    <Grid xs="auto">
      <IconButton
        aria-label="-"
        size="small"
        onClick={fItemMenuOpen}
      >
        <MoreHorizIcon fontSize="inherit" />
      </IconButton>
    </Grid>
  </Grid>
}
