import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ViewerDialogSlide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.closeViewer();
    };
    handleViewer=()=>{
        this.setState({ open: false });
        this.props.closeViewer();
        window.open(this.props.viewPath);
    };

    render() {
        return (
            <div>
                {/*<Button onClick={this.handleClickOpen}>Slide in alert dialog</Button>*/}
                <Dialog
                    open={this.state.open||this.props.viewFile}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"是否预览已获取的文件？"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            我们已经从被监控手机设备获取了{this.props.viewName}文件，请问是否预览此文件？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            不用了，谢谢
                        </Button>
                        <Button onClick={this.handleViewer} color="secondary">
                            预览
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ViewerDialogSlide;