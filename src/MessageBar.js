import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}
let message = '';
class DirectionSnackbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            Transition: null,
            vertical: 'top',
            horizontal: 'center',
            fileArray:[]
        };
    }
    componentDidMount(props){
        this.setState({
            fileArray:this.props.newfileArray
        })
    }
    handleClick = state => () => {
        this.setState({ open: true, ...state });
    };

    handleClose = () => {

        this.setState({ open: false });
        this.props.clearMessage();
    };

    render() {
        const { vertical, horizontal, open } = this.state;
        return (
            <div>
                {/*<Button onClick={this.handleClick({ vertical: 'top', horizontal: 'right' })}>*/}
                    {/*Top-Right*/}
                {/*</Button>*/}
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={this.props.openMessage}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={
                        this.state.fileArray.map((filename,i)=>{
                            return(
                                i===0?<span key={i} id="message-id">{"新增文件名："+filename}
                    </span>:<span key={i} id="message-id">{' 、 '+filename}
                    </span>
                            )
                        })
                        }
                />
            </div>
        );
    }
}

export default DirectionSnackbar;