const API = "https://viyro-backend.onrender.com";

let mediaRecorder;
let stream;

const video = document.getElementById("preview");

async function startCamera(){

stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:false
});

video.srcObject = stream;

mediaRecorder = new MediaRecorder(stream,{
mimeType:"video/webm"
});

mediaRecorder.ondataavailable = async (e)=>{

let blob = e.data;

let base64 = await blobToBase64(blob);

let imgBlob = await base64ToImage(base64);

uploadImage(imgBlob);

};

mediaRecorder.start(2000);
}

function stopCamera(){

mediaRecorder.stop();

stream.getTracks().forEach(t=>t.stop());

}

document.getElementById("start").onclick=startCamera;
document.getElementById("stop").onclick=stopCamera;

function blobToBase64(blob){

return new Promise(r=>{

let reader = new FileReader();

reader.onloadend = ()=>{

r(reader.result.split(",")[1]);

};

reader.readAsDataURL(blob);

});

}

function base64ToImage(data){

let size = Math.ceil(Math.sqrt(data.length));

let canvas = document.createElement("canvas");

canvas.width = size;
canvas.height = size;

let ctx = canvas.getContext("2d");

let imgData = ctx.createImageData(size,size);

for(let i=0;i<data.length;i++){

imgData.data[i] = data.charCodeAt(i);

}

ctx.putImageData(imgData,0,0);

return new Promise(r=>{

canvas.toBlob(r,"image/png");

});

}

async function uploadImage(blob){

let form = new FormData();

form.append("image",blob);

await fetch(`${API}/upload`,{

method:"POST",
body:form

});

}
