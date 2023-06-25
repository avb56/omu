import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';

export default function ItemDialog({
  itemDialogOpen, setItemDialogOpen, oItemOptions, setItemOptions, aTreeData, setTreeData, setExpanded, setSelected
}) {
  const { node, id } = oItemOptions;
  const [editMode, setEditMode] = React.useState(false);
  const sTitle = editMode == 'Add' ? '' : node.title;
  const sDescription = editMode == 'Add' ? undefined : node.description;
  // const [sDescription, setDescription] = React.useState();

  function handleClose(ev) {
    if (editMode) {
      const oFormData = new FormData(ev.target.closest('button').form);
      const descriptionFix = oFormData.get('description') || undefined; // null != undefined
      if (sTitle != oFormData.get('title') || sDescription != descriptionFix)
        if (!confirm('Закрыть БЕЗ сохранения изменений?')) return;
        // console.log('1:'+sDescription, '2:'+descriptionFix);
      setEditMode(false);
    }
    setItemDialogOpen(false);
  }

  function handleEdit(ev) {
    if (!editMode) return setEditMode(true);
    const oFormData = new FormData(ev.target.closest('button').form);
    const aNewData = [ ...aTreeData ];
    let oNode = id.reduce((node, index) => node.children[index], { children: aNewData });
    let newId;
    if (editMode == 'Add') {
      if (!oNode.children) oNode.children = [];
      oNode.children.push({});
      const addIndex = oNode.children.length - 1;
      newId = id.concat(addIndex);
      oNode = oNode.children[addIndex];
      setItemOptions({ node: oNode, id: newId });
    }
    oNode.title = oFormData.get('title');
    oNode.description = oFormData.get('description') || undefined;
    setTreeData(aNewData);
    setEditMode(false);
    if (newId) {
      setExpanded(prev => prev.concat(id.join('/')));
      setSelected(newId.join('/'));
    }
    // console.log(...oFormData.values());
  }

  React.useEffect(() => {
    if (itemDialogOpen == 'Edit') {
      setItemDialogOpen(true);
      setEditMode(true);
    }
    if (itemDialogOpen == 'Add') {
      setItemDialogOpen(true);
      setEditMode('Add');
    }
  });

  return (
    <Dialog
      fullScreen
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={!!itemDialogOpen}
      PaperComponent={'form'}
      sx={{ '& .MuiDialog-paper': { backgroundColor: 'white' } }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs>{editMode
            ? <TextField
                label="Заголовок" variant="outlined" fullWidth name='title'
                defaultValue={sTitle} autoFocus={editMode == 'Add'}
              />
            : <Typography variant="h5">{node.title}</Typography>
          }</Grid>
          <Grid xs="auto">
            <IconButton
              aria-label="Edit"
              size="small"
              onClick={handleEdit}
            >
             {editMode ? <SaveIcon fontSize="inherit" /> : <EditIcon fontSize="inherit" />}
            </IconButton>
          </Grid>
          <Grid xs="auto">
            <IconButton
              aria-label="Close"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>{editMode
        ? <TextField label="Описание" name='description' variant="outlined" fullWidth multiline
            defaultValue={sDescription}
          />
        : <Typography component="pre" gutterBottom>{node.description}</Typography>
      }</DialogContent>
    </Dialog>
  );
}
