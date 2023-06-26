import * as React from 'react';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIconInit from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

export default function ItemMenu(props) {
  const { anchorEl, setAnchorEl, setItemDialogOpen, oItemOptions, aTreeData, setTreeData } = props;
  const ListItemIcon = props => <ListItemIconInit { ...props } sx={{ mr: 2 }} />;
  const [oItemBuffer, setItemBuffer] = React.useState();
  const handleClose = () => setAnchorEl(null);

  const handleOpenItem = () => {
    setItemDialogOpen(true);
    handleClose();
  };

  const handleEditItem = () => {
    setItemDialogOpen('Edit');
    handleClose();
  };

  const handleAddItem = () => {
    setItemDialogOpen('Add');
    handleClose();
  };
  
  const handleCutItem = () => {
    const aIds = [ ...oItemOptions.id ];
    const nCurrentIndex = aIds.pop();
    const aNewData = [ ...aTreeData ];
    const oParentNode = aIds.reduce((node, index) => node.children[index], { children: aNewData });
    setItemBuffer(oParentNode.children.splice(nCurrentIndex, 1));
    setTreeData(aNewData);
    // console.log(aIds, nCurrentIndex)
    handleClose();
  };

  return <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    <MenuItem onClick={handleOpenItem}>
      <ListItemIcon>
        <ListAltIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Открыть</ListItemText>
    </MenuItem>
    <MenuItem onClick={handleEditItem}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Править</ListItemText>
    </MenuItem>
    <MenuItem onClick={handleAddItem}>
      <ListItemIcon>
        <PostAddIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Добавить</ListItemText>
    </MenuItem>
    <Divider/>
    <MenuItem>
      <ListItemIcon>
        <ArrowCircleUpIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вверх</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <ArrowCircleDownIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вниз</ListItemText>
    </MenuItem>
    <Divider/>
    <MenuItem onClick={handleCutItem}>
      <ListItemIcon>
        <ContentCut fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вырезать</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <ContentCopy fontSize="small" />
      </ListItemIcon>
      <ListItemText>Копировать</ListItemText>
    </MenuItem>
    <MenuItem disabled={!oItemBuffer}>
      <ListItemIcon>
        <ContentPaste fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вставить</ListItemText>
    </MenuItem>
  </Menu>
}