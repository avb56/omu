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
  const [itemDialogOpen, setItemDialogOpen] = React.useState(false);
  const [oItemOptions, setItemOptions] = React.useState({ oNode: {} });
  const [aTreeData, setTreeData] = React.useState(data);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [aExpanded, setExpanded] = React.useState([]);
  const [sSelected, setSelected] = React.useState(null);
  const [oItemBuffer, setItemBuffer] = React.useState();
  const handleClose = () => setAnchorEl(null);

  React.useEffect(() => {
    document.getElementById('root').onclick = ev => {
      if (!ev.target.closest('button#ItemAddRoot')) return;
      if (oItemBuffer && confirm('Вставить из буфера?')) {
        setTreeData(aPrevData => [ ...aPrevData, oItemBuffer ]);
        setSelected(String(aTreeData.length));
        return;
      }
      setItemOptions({ oNode: {}, aId: [] });
      setItemDialogOpen('Add');
      // console.log('test');
    }
  });

  return <ItemDialogContext.Provider value={{
    setItemDialogOpen, setItemOptions, setAnchorEl, setSelected
  }}>
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={aExpanded}
      selected={sSelected}
      onNodeToggle={(ev, aNodeIds) => setExpanded(aNodeIds)}
      onNodeSelect={(ev, sNodeId) => setSelected(sNodeId)}
    >
      {aTreeData.map((oNode, nIndex) => renderTree(oNode, [nIndex]))}
    </TreeView>
    <ItemDialog { ...{
      itemDialogOpen, setItemDialogOpen, oItemOptions, setItemOptions, aTreeData, setTreeData, setExpanded, setSelected
    }} />
    <ItemMenu { ...{
      anchorEl, handleClose, setItemDialogOpen, oItemOptions, aTreeData, setTreeData, setExpanded, oItemBuffer, setItemBuffer, setSelected, setItemOptions
    }} />
  </ItemDialogContext.Provider>
}

const renderTree = (oNode, aId) => (
  <TreeItem
    key={aId.join('/')} nodeId={aId.join('/')}
    sx={{ '& .MuiTreeItem-content': { p: 0 } }}
    label={<LabelRow aId={aId} oNode={oNode} />}
  >
    {Array.isArray(oNode.children)
    ? oNode.children.map((oSubNode, nIndex) => renderTree(oSubNode, aId.concat(nIndex)))
    : null}
  </TreeItem>
);

function LabelRow(props) {
  const handleRowClick = ev => console.log(ev.detail == 2);
  const { setItemDialogOpen, setItemOptions, setAnchorEl, setSelected } = React.useContext(ItemDialogContext);

  function fItemMenuOpen(ev) {
    ev.stopPropagation();
    setItemOptions(props);
    setAnchorEl(ev.currentTarget);
    setSelected(props.aId.join('/'));
    // console.log(ev.currentTarget);
  }

  function fItemDialogOpen() {
    setItemOptions(props);
    setItemDialogOpen(true);
    // console.log(props.aId.join('/'));
  }

  return <Grid
    container spacing={2}
    alignItems="center"
  > 
    <Grid xs
      onClick={ev => ev.detail == 2 && fItemDialogOpen()}
    >{props.oNode.title}</Grid>
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
