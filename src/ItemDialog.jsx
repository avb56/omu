import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';

export default function ItemDialog({
  bItemDialogOpen, setItemDialogOpen, oItemDialogOptions, aTreeData, setTreeData
}) {
  const { node, id } = oItemDialogOptions;
  const [bEditMode, setEditMode] = React.useState(false);
  // const [sTitle, setTitle] = React.useState(node.name);
  // const [sDescription, setDescription] = React.useState();

  function handleClose(ev) {
    if (bEditMode) {
      const oFormData = new FormData(ev.target.closest('button').form);
      const descriptionFix = oFormData.get('description') || undefined; // null != undefined
      if (node.title != oFormData.get('title') || node.description != descriptionFix)
        if (!confirm('Имеются несохранённые данные. Закрыть без сохранения?')) return;
        // console.log('1:'+node.description, '2:'+descriptionFix);
      setEditMode(false);
    }
    setItemDialogOpen(false);
  }

  function handleEdit(ev) {
    if (!bEditMode) return setEditMode(true);
    const oFormData = new FormData(ev.target.closest('button').form);
    const aNewData = [ ...aTreeData ];
    const oNode = id.reduce((node, index) => node.children[index], { children: aNewData });
    oNode.title = oFormData.get('title');
    oNode.description = oFormData.get('description') || undefined;
    setTreeData(aNewData);
    setEditMode(false);
    // console.log(...oFormData.values());
  }

  React.useEffect(() => {
    if (bItemDialogOpen == 'Edit') {
      setItemDialogOpen(true);
      setEditMode(true);
    }
  });

  return (
    <Dialog
      fullScreen
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={!!bItemDialogOpen}
      PaperComponent={'form'}
      sx={{ '& .MuiDialog-paper': { backgroundColor: 'white' } }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Grid
          container spacing={2}
          alignItems="center"
        >
          <Grid xs>{bEditMode
            ? <TextField label="Заголовок" variant="outlined" fullWidth name='title' defaultValue={node.title} />
            : <Typography variant="h5">{node.title}</Typography>
          }</Grid>
          <Grid xs="auto">
            <IconButton
              aria-label="Edit"
              size="small"
              onClick={handleEdit}
            >
             {bEditMode ? <SaveIcon fontSize="inherit" /> : <EditIcon fontSize="inherit" />}
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
      <DialogContent dividers>{bEditMode
        ? <TextField label="Описание" name='description' variant="outlined" fullWidth multiline
            defaultValue={node.description}
          />
        : <Typography component="pre" gutterBottom>{node.description}</Typography>
      }</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
