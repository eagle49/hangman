$(document).ready(function () {
	
	var questionBank=new Array;
	var wordArray=new Array;
	var previousGuesses=new Array;
 	var currentWord;
	var currentClue;
	var wrongAnswerCount;
	var radioValue;
	
 
 
questionBank=	[["kangaroo","an animal"],["starbucks","a company"],["macaroni","a kind of food"],["washington","a place"],["turtle","a creature"],["guillotine","a machine"]];

		$.ajaxSetup({
			async: false
		});
		
		// $.getJSON('https://hangman-micro-service-bpblrjerwh.now.sh/?difficulty='+radioValue, function(data) { 


		// for(i=0;i<data.wordlist.length;i++){ 
		// 	questionBank[i]=new Array;
		// 	questionBank[i][0]=data.wordlist[i].word;
		// 	questionBank[i][1]=data.wordlist[i].clue;
		// }
		// })//gtjson
		 
		titleScreen();

 

 
	
function titleScreen(){
	$('#gameContent').empty();
	$('#gameContent').append('<div id="gameTitle">HANGMAN</div><div style="text-align: center;"><input type="radio" id="easy" name="difficulty" value="easy" checked /><label for="easy">easy</label><input type="radio" id="medium"name="difficulty" value="medium" /><label for="medium">medium</label><input type="radio" id="hard"name="difficulty" value="hard" /><label for="hard">hard</label></div><div id="startButton" class="button">BEGIN</div>');		
	$('#startButton').on("click",function (){
		console.log("came");
		radioValue = $("input[name='difficulty']:checked").val();
		if(radioValue){
			// console.log(radioValue);
		}
		$.getJSON('https://hangman-micro-service-bpblrjerwh.now.sh/?difficulty='+radioValue, function(data) { 

		console.log(data["word"]);
		currentWord = data["word"];
		})//gtjson
		gameScreen()});
			
}//display game
	
	
	
function gameScreen(){

	$('#gameContent').empty();
	$('#gameContent').append('<div id="pixHolder"><img id="hangman" src="man.png"></div>');
	$('#gameContent').append('<div id="wordHolder"></div>');
	// $('#gameContent').append('<div id="clueHolder"></div>');
	$('#gameContent').append('<div id="guesses">Previous guesses:</div>');
	$('#gameContent').append('<div id="feedback"></div>');
	$('#gameContent').append('<form><input type="text" id="dummy" ></form>');
			
	getWord();
	var numberOfTiles=currentWord.length;
	wrongAnswerCount=0;
	previousGuesses=[];
			 
	for(i=0;i<numberOfTiles;i++){
		$('#wordHolder').append('<div class="tile" id=t'+i+' style="margin:5px"></div>');
	}
			
	$('#clueHolder').append("HINT: "+currentClue);
 
	$(document).on("keyup",handleKeyUp);
	$(document).on("click",function(){$('#dummy').focus();});
	$('#dummy').focus();
}//gamescreen
			
			
function getWord(){
	var rnd=Math.floor(Math.random()*questionBank.length);
	// currentWord=questionBank[rnd][0];
	currentClue=questionBank[rnd][1];
	questionBank.splice(rnd,1);
	// console.log(currentWord);
	wordArray=currentWord.split("");
}//getword
			
function handleKeyUp(event) {
	if(event.keyCode>64 && event.keyCode<91){
		var found=false;
		var previouslyEntered=false;
		var input=String.fromCharCode(event.keyCode).toLowerCase();
				
		for(i=0;i<previousGuesses.length;i++){if(input==previousGuesses[i]){previouslyEntered=true;}}
				
		if(!previouslyEntered){
			previousGuesses.push(input);
				
			for(i=0;i<wordArray.length;i++){
				
				if(input==wordArray[i]){found=true;$('#t'+i).append(input);}	
				
			}//for
				
			if(found){checkAnswer();}
			else{wrongAnswer(input);}
		}//if
	}//if
}//handlekeyup
	
		
function checkAnswer(){
	var currentAnswer="";	
	for(i=0;i<currentWord.length;i++){
		currentAnswer+=($('#t'+i).text());
	}		
	if(currentAnswer==currentWord){
		victoryMessage();
	};
}//checkanswer
		
function wrongAnswer(a){
	wrongAnswerCount++;
	var pos=(wrongAnswerCount*-75) +"px"
	$('#guesses').append("  "+a);
	$('#hangman').css("left",pos);
	if(wrongAnswerCount==6){
		defeatMessage();}
}//wronganswer
		
function victoryMessage(){
	$(document).off("keyup", handleKeyUp);
	$('#feedback').append("CORRECT!<br><br><div id='replay' class='button'>Play again</div>");
	$('#replay').on("click",function (){
		// if(questionBank.length>0){
		// 	gameScreen()}
		titleScreen();
		// else{finalPage()}
	});
}//victory
		
function defeatMessage(){
	$(document).off("keyup", handleKeyUp);
	$('#feedback').append("You're Dead!<br>(answer= "+ currentWord +")<div id='replay' class='button'>Play again</div>");
	$('#replay').on("click",function (){
		// if(questionBank.length>0){
		// 	gameScreen()}
		// else{finalPage()}
		titleScreen();
	});
}//defeat

function finalPage(){
	$('#gameContent').empty();
	$('#gameContent').append('<div id="finalMessage">You have finished all the words in the game!</div>');
}//finalpage
	
	});//doc ready