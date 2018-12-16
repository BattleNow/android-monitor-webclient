// import openSocket from 'socket.io-client';
// const socket = openSocket('http://149.28.202.19:3030');
//
// function subscribeToServer() {
//     let checkWord;
//     socket.on('Browser',(msg)=>{
//         console.log(msg);
//         if(msg)
//         {
//             checkWord = msg.id;
//             socket.emit('Browser',{"id":checkWord});
//             socket.on('BrowserBack',(msg)=>{
//                 if(msg&&msg.identity)
//                 {
//                     socket.emit('BrowseruploadList',{"mission":"uploadList"});
//                     console.log('I request the server to send back list');
//                 }
//             })
//             socket.on('BrowserGetList',(list)=>{
//                 console.log(JSON.parse(list));
//             })
//         }
//     });
// }
//
// export {subscribeToServer}