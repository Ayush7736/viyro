const video = document.getElementById("player");

async function poll(){

let res = await fetch("/latest");

let url = await res.text();

if(!url) return;

let base64 = await imageToBase64(url);

playChunk(base64);

}

setInterval(poll,2000);

function imageToBase64(url){

return new Promise(r=>{

let img = new Image();

img.crossOrigin="anonymous";

img.onload=()=>{

let canvas=document.createElement("canvas");

canvas.width=img.width;
canvas.height=img.height;

let ctx=canvas.getContext("2d");

ctx.drawImage(img,0,0);

let data = ctx.getImageData(0,0,img.width,img.height).data;

let text="";

for(let i=0;i<data.length;i++){

if(data[i]==0) break;

text += String.fromCharCode(data[i]);

}

r(text);

};

img.src=url;

});
}

function playChunk(base64){

let blob = base64ToBlob(base64);

video.src = URL.createObjectURL(blob);

}

function base64ToBlob(b64){

let byteChars = atob(b64);

let byteArray = new Uint8Array(byteChars.length);

for(let i=0;i<byteChars.length;i++){

byteArray[i] = byteChars.charCodeAt(i);

}

return new Blob([byteArray],{type:"video/webm"});

}
