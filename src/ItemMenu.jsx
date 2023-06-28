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

function deepClone(src, destination) {
  let clone = destination || (src instanceof Array ? [] : {});
  for (let key in src) if (typeof src[key] == 'object') {
    if (!clone[key]) clone[key] = (src[key] instanceof Array ? [] : {})
    deepClone(src[key], clone[key]);
  } else clone[key] = src[key];
  return clone;
}

export default function ItemMenu(props) {
  const { anchorEl, handleClose, setItemDialogOpen, oItemOptions, aTreeData, setTreeData, setExpanded, oItemBuffer, setItemBuffer, setSelected, setItemOptions } = props;
  const ListItemIcon = props => <ListItemIconInit { ...props } sx={{ mr: 2 }} />;

  const handleMenuItem = sType => {
    sType == 'Copy' ? setItemBuffer(oItemOptions.oNode) : setItemDialogOpen(sType);
    handleClose();
  };
  // console.log(JSON.stringify(oItemOptions.oNode, null, 2))

  const handleMoveItem = nSteep => {
    const aIdClone = [ ...oItemOptions.aId ];
    const nCurrentIndex = aIdClone.pop();
    const aNewData = [ ...aTreeData ];
    const oParentNode = aIdClone.reduce((oSubNode, nIndex) => oSubNode.children[nIndex], { children: aNewData });
    let nNewIndex = nCurrentIndex + nSteep;
    if (nNewIndex < 0) nNewIndex += oParentNode.children.length;
    if (nNewIndex == oParentNode.children.length) nNewIndex = 0;
    const aNewId = aIdClone.concat(nNewIndex);
    const oMovedNode = oParentNode.children.splice(nCurrentIndex, 1)[0];
    if (nSteep) {
      oParentNode.children.splice(nNewIndex, 0, oMovedNode);
      setSelected(aNewId.join('/'));
      setItemOptions(oPrev => ({ ...oPrev, aId: aNewId }));
      // setItemOptions({ oNode: oMovedNode, aId: aNewId });
      // console.log(oMovedNode == oItemOptions.oNode)
    } else {
      setItemBuffer(oMovedNode);
      handleClose();
    }
    setTreeData(aNewData);
  };

  const handlePasteItem = () => {
    const oNode = oItemOptions.oNode;
    if (!oNode.children) oNode.children = [];
    oNode.children.push(deepClone(oItemBuffer));
    setTreeData(aPrevData => [ ...aPrevData ]);
    setExpanded(aPrev => aPrev.concat(oItemOptions.aId.join('/')));
    handleClose();
    // console.log(JSON.stringify(oItemBuffer, null, 2))
  };

  return <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    <MenuItem onClick={ev => handleMenuItem('Open')}>
      <ListItemIcon>
        <ListAltIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Открыть</ListItemText>
    </MenuItem>
    <MenuItem onClick={ev => handleMenuItem('Edit')}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Править</ListItemText>
    </MenuItem>
    <MenuItem onClick={ev => handleMenuItem('Add')}>
      <ListItemIcon>
        <PostAddIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Добавить</ListItemText>
    </MenuItem>
    <Divider/>
    <MenuItem onClick={ev => handleMoveItem(-1)}>
      <ListItemIcon>
        <ArrowCircleUpIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вверх</ListItemText>
    </MenuItem>
    <MenuItem onClick={ev => handleMoveItem(1)}>
      <ListItemIcon>
        <ArrowCircleDownIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вниз</ListItemText>
    </MenuItem>
    <Divider/>
    <MenuItem onClick={ev => handleMoveItem(0)}>
      <ListItemIcon>
        <ContentCut fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вырезать</ListItemText>
    </MenuItem>
    <MenuItem onClick={ev => handleMenuItem('Copy')}>
      <ListItemIcon>
        <ContentCopy fontSize="small" />
      </ListItemIcon>
      <ListItemText>Копировать</ListItemText>
    </MenuItem>
    <MenuItem onClick={handlePasteItem} disabled={!oItemBuffer}>
      <ListItemIcon>
        <ContentPaste fontSize="small" />
      </ListItemIcon>
      <ListItemText>Вставить</ListItemText>
    </MenuItem>
  </Menu>
}