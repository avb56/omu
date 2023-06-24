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
import ItemMenu from './ItemMenu';

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

export default function MainTreeView() {
  const [bItemDialogOpen, setItemDialogOpen] = React.useState(false);
  const [oItemDialogOptions, setItemDialogOptions] = React.useState({ node: {} });
  const [aTreeData, setTreeData] = React.useState(data);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sSelected, setSelected] = React.useState(null);

  return <ItemDialogContext.Provider value={{
    setItemDialogOpen, setItemDialogOptions, setAnchorEl, setSelected
  }}>
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      selected={sSelected}
      onNodeSelect={(ev, sNodeId) => setSelected(sNodeId)}
    >
      {aTreeData.map((node, i) => renderTree(node, [i]))}
    </TreeView>
    <ItemDialog { ...{
      bItemDialogOpen, setItemDialogOpen, oItemDialogOptions, aTreeData, setTreeData
    }} />
    <ItemMenu { ...{
      anchorEl, setAnchorEl, setItemDialogOpen
    }} />
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
  const { setItemDialogOpen, setItemDialogOptions, setAnchorEl, setSelected } = React.useContext(ItemDialogContext);

  function fItemMenuOpen(ev) {
    ev.stopPropagation();
    setItemDialogOptions(props);
    setAnchorEl(ev.currentTarget);
    setSelected(props.id.join('/'));
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