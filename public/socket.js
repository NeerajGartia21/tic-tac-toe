const socket=io();
let turn;
let roomId;
let mySymbol;

let Winning = [
    ["1", "2", "3"],
    ["2", "5", "8"],
    ["4", "5", "6"],
    ["3", "6", "9"],
    ["7", "8", "9"],
    ["1", "4", "7"],
    ["1", "5", "9"],
    ["3", "5", "7"],
];
let currentX = [];
let currentO = [];
let remaining = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];


function reset() {
    document.querySelector(".box").innerHTML = `<h1>Tic Tac Toe</h1>

	<button onclick="createRoom()" id="create-room">Create Room</button>

	<input id="room-id" type="text" placeholder="room-id">
	<button onclick="joinRoom()" id="join-room">Join Room</button>`;
    currentX=[];
    currentO=[];
    remaining = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
}


function createRoom(){
    roomId=Math.floor(100000 + Math.random() * 900000);
    turn=1;
    mySymbol='X';
    socket.emit('player-joined',roomId);
    document.querySelector('.box').innerHTML=`
    <div>
		room id - ${roomId}
	</div>
    <div class="container">
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="1">1</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="2">2</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="3">3</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="4">4</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="5">5</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="6">6</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="7">7</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="8">8</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="9">9</div>
    </div>
    `
}


function joinRoom(){
    
    roomId=document.getElementById('room-id').value;
    socket.emit('player-joined',roomId);
    document.querySelector('.box').innerHTML=`
    <div>
		room id - ${roomId}
	</div>
    <div class="container">
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="1">1</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="2">2</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="3">3</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="4">4</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="5">5</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="6">6</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="7">7</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="8">8</div>
		<div onclick="multiPlayer(this);" style="color: transparent;" class="box" id="9">9</div>
    </div>
    `
    turn=0;
    mySymbol='O';
}


function multiPlayer(target){
    target.onclicK=null;
    if(turn){
        socket.emit(`room`,{id:target.id,symbol:mySymbol,roomId:roomId});
        target.innerText = mySymbol;
        target.style.color = "red";
        currentX.push(target.id);
        currentX = Array.from(new Set(currentX));
        remaining.splice(remaining.indexOf(target.id), 1);
        if(checkStatus()){
            return;
        }
    }
    turn=0;
}

socket.on(`won`,function(data){
    alert(data.msg);
    reset();
})

socket.on(`room`,function(data){
    console.log('Got')
    let target=document.getElementById(data.id);
    turn=1;
    target.innerText = data.symbol;
    target.style.color = "red";
})


function checkStatus() {
    let flag = 0;
    for (let i = 0; i < Winning.length; i++) {
        if (check_sub_array(currentX, Winning[i]).length == 0) {
            alert("YOU WON");
            socket.emit('won',{msg:"opponent won",roomId:roomId});
            flag++;
            break;
        } else if (check_sub_array(currentO, Winning[i]).length == 0) {
            alert("COMPUTER OWN");
            flag++;
            break;
        }
    }
    if (flag) {
        reset();
        return 1;
    }
}

function check_sub_array(superarr, subarr) {
    let remainingarr = [];
    subarr.forEach(function (element) {
        if (!superarr.includes(element)) {
            remainingarr.push(element);
        }
    });
    return remainingarr;
}