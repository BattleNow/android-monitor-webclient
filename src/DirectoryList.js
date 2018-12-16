import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/PhotoSizeSelectActual';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import FolderIcon from '@material-ui/icons/Folder';
import MovieIcon from '@material-ui/icons/Videocam';
import FileIcon from '@material-ui/icons/InsertDriveFile'
import GetFileIcon from '@material-ui/icons/GetApp'
import InputIcon from '@material-ui/icons/Input'
import BackIcon from '@material-ui/icons/Reply'
import RefreshIcon from '@material-ui/icons/Refresh'
import { FilePond, registerPlugin } from 'react-filepond';
import DirectionSnackbar from './MessageBar';
//import {subscribeToServer} from './api';
// import socket from './api'
import AlertDialogSlide from './DialogSlide';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import openSocket from 'socket.io-client';
import LinearProgress from '@material-ui/core/LinearProgress';
import ViewerDialogSlide from './Viewer'
const socket = openSocket('http://149.28.202.19:3030');
const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    colorPrimary:{
        backgroundColor: "#f50057",
    },
    processline:{
        marginTop:16
    },
    refreshButton:{
        marginLeft: 16
    }
});
let pathArray = new Array();
let index = 0;
let currentPath = '/';
let emitId = '';
let selectedIndex = -1;
let missionOn = '';
let newfileArray = new Array();
let checkfileArray = new Array();
let howmanyfiles = 0;
let notstartcheck = true;
class FolderList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            filesInfo:[],
            ButtonDown:false,
            selectedObj:[],
            showprocessline:false,
            newfileArray:[],
            openMessage:false,
            ViewFile:false,
            ViewPath:'',
            ViewName:'',
            mustnotback:false
        };
        this.subscribeToServer();
    }
    randomWord=(randomFlag,min,max)=>{
        let str = "",
            range = min,
            arr = ['0','1','2','3','4','5','6','7','8','9'
                ,'a','b','c','d','e','f','g','h','i','j','k','l','m'
                ,'n','o','p','q','r','s','t','u','v','w','x','y','z'];
        if(randomFlag){
            range = Math.round(Math.random()*(max-min))+min;
        }
        for(let i=0;i<range;i++){
            let pos = Math.round(Math.random()*(arr.length-1));
            str += arr[pos];
        }
        return str;
    };

    moveforward=(foldername)=>{
        if(currentPath==='/'){
            let check = false;
            this.state.filesInfo.map((item,i)=>{
                if(foldername===item.name){
                    check = true;
                }
            });
            if(check){
                pathArray.push(currentPath);
                currentPath = currentPath+foldername;
                missionOn = 'uploadList';
                socket.emit('BrowseruploadList',{"mission":"uploadList","path":currentPath});
            }else {
                missionOn = 'uploadList';
                socket.emit('BrowseruploadList',{"mission":"uploadList","path":currentPath});
            }
        }else {
            let check = false;
            this.state.filesInfo.map((item,i)=>{
                if(foldername===item.name){
                    check = true;
                }
            });
            if(check){
                pathArray.push(currentPath);
                currentPath = currentPath+'/'+foldername;
                missionOn = 'uploadList';
                socket.emit('BrowseruploadList',{"mission":"uploadList","path":currentPath});
            }else {
                missionOn = 'uploadList';
                socket.emit('BrowseruploadList',{"mission":"uploadList","path":currentPath});
            }
        }
        console.log("parent:"+pathArray[pathArray.length-1]);
        console.log("current"+currentPath);
    };
    moveback=()=>{
        currentPath=pathArray[pathArray.length-1];
        missionOn = 'uploadList';
        socket.emit('BrowseruploadList',{"mission":"uploadList","path":currentPath});
        pathArray.pop();
    };
    getlist=()=>{
        socket.emit('BrowseruploadList',{"mission":"uploadList","path":currentPath});
    };
    subscribeToServer=()=> {
        socket.on('BrowserBack',(msg)=>{
            console.log(msg);
            if(msg.connected){
                this.getlist();
            }
        });
        socket.on('BrowserGetList',(list)=>{
            console.log(JSON.parse(list));
            selectedIndex = -1;

            this.setState({
                filesInfo:JSON.parse(list).directory,
                ButtonDown:false,
                showprocessline:false
            });
            if(checkfileArray.length===0){
                console.log("自检完毕");
            }else {
                //自检
                console.log("==========开始自检===========");
                //let count = 0;
                let listGot = JSON.parse(list).directory;
                // let foundIndex = new Array();
                for(let j = 0;j<checkfileArray.length;j++){
                    for(let k=0;k<listGot.length;k++){
                        if(checkfileArray[j]===listGot[k].name){
                            // foundIndex.push(j);
                            console.log("找到："+checkfileArray[j]);
                            checkfileArray.splice(j,1);
                            console.log("=====剩下开始=====");
                            for(let q=0;q<checkfileArray.length;q++){
                                console.log(checkfileArray[q]);
                            }
                            console.log(checkfileArray.length);
                            if(checkfileArray.length===0){

                                this.setState({
                                    showprocessline:false,
                                    openMessage:true,
                                    mustnotback:false
                                });
                                console.log("全部找到");
                                this.getlist();
                            }
                            console.log("=====剩下结束=====");
                            //count++;
                        }
                    }
                }
                // for(let q=0;q<foundIndex.length;q++){
                //     checkfileArray.splice(foundIndex[q],1);
                // }
                //foundIndex.splice(0,foundIndex.length);
                if(checkfileArray.length===0) {
                    // if(this.state.showprocessline){
                    //     this.setState({
                    //         showprocessline:false,
                    //         openMessage:true
                    //     });
                    //     console.log("全部找到");
                    //     this.getlist();
                    //     ///
                    // }
                }else {
                    console.log("我再问问服务器，还有"+(checkfileArray.length)+"没拿到");
                    this.setState({
                        showprocessline:true
                    });
                    this.getlist();
                }
            }

        });
        socket.on('GetCurrentPath',(info)=>{
            if(info){
                console.log("[服务器]：存哪呀？");
                console.log(info);
                if(currentPath==='/'){
                    socket.emit('GetCurrentPathBack',{"id":info.id,"from":info.downloadpath,"to":currentPath+info.name});
                }else {
                    socket.emit('GetCurrentPathBack',{"id":info.id,"from":info.downloadpath,"to":currentPath+'/'+info.name});
                }
                console.log(info.id);
                console.log('from:'+info.downloadpath);
                console.log('to:'+currentPath+'/'+info.name);
                newfileArray.push(info.name);
                checkfileArray.push(info.name);
                howmanyfiles--;
                this.getlist();
                console.log("howmany："+howmanyfiles);
                if(howmanyfiles===0){
                    console.log("遍历完成！");
                    this.getlist();
                }
            }
        });
        socket.on('DownloadFromPhone',(info)=>{
           if(info){
               this.setState({
                   ButtonDown:false,
                   ViewFile:true,
                   ViewPath:info.path,
                   ViewName:info.name
               });
               console.log("下载地址："+info.path);
               console.log("名称另存为："+info.name);
               console.log(this.state.ViewFile);
           }
        })

    };
    componentDidMount(props){

        if(this.state.filesInfo.length===0){
            this.setState({
                ButtonDown:true
            })
        }

    }

    handleListItemClick = (event, index) => {
        //console.log(index);
        //console.log(this.state.filesInfo[index]);
        selectedIndex = index;
        this.setState({selectedObj:this.state.filesInfo[index]});
        console.log("index: "+selectedIndex)
        //let fileObj = document.getElementById('filename');

    };
    handleObtain=(event)=>{
        selectedIndex = -1;
        this.setState({ButtonDown:true});
        if(currentPath==='/'){
            socket.emit('GetFileFromPhone',{"path":currentPath+this.state.selectedObj.name});
        }else{
            socket.emit('GetFileFromPhone',{"path":currentPath+'/'+this.state.selectedObj.name});
        }
    };
    handleTrigger = (event)=>{
        selectedIndex = -1;
        this.setState({ButtonDown:true});
        //console.log(this.state.selectedObj.name);
        console.log("index: "+selectedIndex)
        this.moveforward(this.state.selectedObj.name);
    };

    handleBack = (event)=>{
        selectedIndex = -1;
        this.setState({ButtonDown:true});
        //console.log(this.state.selectedObj.name);
        this.moveback();
    };
    handleRefresh=(event)=>{
        this.setState({
            showprocessline:true
        });
        this.getlist();
    };
    handleCloseViewer=()=>{
        this.setState({
            ViewFile:false
        })
    };
    fileinit=()=>{
        console.log("fileinit");
    };
    filewarning=()=>{
        console.log("filewarning");
    };
    fileerror=()=>{
        console.log("fileerror");
    };
    addfilestart=()=>{
        console.log("addfilestart");
        this.setState({
            mustnotback:true
        });
    };
    addfileprogress=()=>{
        console.log("addfileprogress");
    };
    addfile=()=>{
        console.log("addfile");
    };
    processfileprogress=()=>{
        console.log("processfileprogress");
    };
    processfileabort=()=>{
        console.log("processfileabort");
    };
    processfileundo=()=>{
        console.log("processfileundo");
    };
    processfile=()=>{
        console.log("processfile");
    };
    removefile=()=>{
        console.log("removefile");
    };
    preparefile=()=>{
        console.log("preparefile");
    };
    updatefiles=()=>{
        console.log("updatefiles");
        howmanyfiles++;

        //this.getlist();
    };
    clearMessage=()=>{
          newfileArray.splice(0,newfileArray.length);
          this.setState({
              openMessage:false
          })
    };
    render(){
        const { classes } = this.props;
        let listInfo = this.state.filesInfo;
        // if(this.state.ButtonDown){
        //     console.log("服务器正在等待。。。");
        //     socket.emit('BrowseruploadList',{"mission":"uploadList","path":currentPath});
        // }
        //this.getlist();

        return (
            <div className={classes.root}>
                <ViewerDialogSlide viewPath={this.state.ViewPath}
                                   viewName={this.state.ViewName}
                                   viewFile={this.state.ViewFile} closeViewer={this.handleCloseViewer}/>
                <DirectionSnackbar newfileArray={newfileArray} clearMessage={this.clearMessage} openMessage={this.state.openMessage}/>
                <FilePond
                    oninit={this.fileinit}
                    onwarning={this.filewarning}
                    onerror={this.fileerror}
                    onaddfilestart={this.addfilestart}
                    onaddfileprogress={this.addfileprogress}
                    onaddfile={this.addfile}
                    onprocessfilestart={this.processfilestart}
                    onprocessfileprogress={this.processfileprogress}
                    onprocessfileabort={this.processfileabort}
                    onprocessfileundo={this.processfileundo}
                    onprocessfile={this.processfile}
                    onremovefile={this.removefile}
                    onpreparefile={this.preparefile}
                    onupdatefiles={this.updatefiles}
                    allowMultiple={true} server="http://149.28.202.19:3300"/>
                {/*<Card>*/}
                    {/*<CardContent></CardContent>*/}
                {/*</Card>*/}
                {currentPath!=='/'&&!this.state.mustnotback?
                    <Button variant="outlined" color="secondary" className={classes.button}
                            onClick={event=>this.handleBack(event)}>
                        Back
                        <BackIcon className={classes.rightIcon} />
                    </Button>:<div></div>}
                <Button variant="outlined" color="secondary" className={classes.button}
                        className={classes.refreshButton}
                        onClick={event=>this.handleRefresh(event)}>
                    Refresh
                    <RefreshIcon className={classes.rightIcon} />
                </Button>
                {this.state.showprocessline?
                    <div className={classes.processline}>
                        <LinearProgress color="secondary" />

                    </div>:
                    <div className={classes.processline}>
                    </div>}
                <List>
                    {
                        listInfo.map((item,i)=>{
                           return(
                               <ListItem key={i} button selected={selectedIndex===i}
                                         onClick={event => this.handleListItemClick(event, i)}>
                                   {selectedIndex===i?
                                       <Avatar className={classes.colorPrimary}>
                                           {item.type==='png'
                                           ||item.type==='jpg'
                                           ||item.type==='jpeg'
                                           ||item.type==='gif'
                                           ||item.type==='svg'?
                                           <ImageIcon/>:item.type==='mp4'
                                               ||item.type==='dat'
                                               ||item.type==='mpg'
                                               ||item.type==='avi'
                                               ||item.type==='mpeg'?
                                           <MovieIcon/>:item.type==='folder'?
                                           <FolderIcon/>:<FileIcon/>}
                                       </Avatar>:
                                       <Avatar>
                                           {item.type==='png'
                                           ||item.type==='jpg'
                                           ||item.type==='jpeg'
                                           ||item.type==='gif'
                                           ||item.type==='svg'?
                                               <ImageIcon/>:item.type==='mp4'
                                               ||item.type==='dat'
                                               ||item.type==='mpg'
                                               ||item.type==='avi'
                                               ||item.type==='mpeg'?
                                                   <MovieIcon/>:item.type==='folder'?
                                                       <FolderIcon/>:<FileIcon/>}
                                       </Avatar>}
                                   <ListItemText primary={item.name} secondary={item.size+" KB"}/>
                                   {selectedIndex===i?
                                       item.type==='folder'?
                                           <Button variant="outlined" color="secondary" className={classes.button}
                                                   onClick={event=>this.handleTrigger(event)}>
                                               Open
                                               <InputIcon className={classes.rightIcon} />
                                           </Button>:
                                           <Button variant="outlined" color="secondary" className={classes.button}
                                                   onClick={event=>this.handleObtain(event)}>
                                               Obtain
                                               <GetFileIcon className={classes.rightIcon} />
                                           </Button>:<div></div>}
                               </ListItem>
                           )
                        })
                    }
                </List>
                <AlertDialogSlide loading={this.state.ButtonDown}/>

            </div>
        );
    }
}

FolderList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FolderList);