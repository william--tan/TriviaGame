//NEW QUESTION OBJECT
var q = function (qu, di, ca, ia){
	this.question = qu;
	this.difficulty = di;
	this.correct = ca;
	this.incorrect = ia;
};

//AJAX REQUEST TO TRIVIA API
var get_data = function(){
	$.ajax({
	      url: "https://opentdb.com/api.php?amount=20&difficulty=medium&type=multiple",
	      method: "GET"
	    }).done(function(data) {
	    	for (let i in data.results)
	    	{
	    		var a = data.results[i];
	    		var b = new q(a.question, a.difficulty, a.correct_answer, a.incorrect_answers);
	    			if (typeof b.question == 'undefined') continue;
	    		trivia.questions.push(b);
	    	}
	    });

};

//ANIMATE ONCE
var animateonce = function (id, animation, delay, speed){
  var classname = id.attr('class');
  if (typeof delay == 'undefined')
    delay = '0s';
  if (typeof speed == 'undefined')
    speed = "0.5s";
  id.removeClass().addClass(animation+" animated "+classname).css({"animation-delay":delay, "animation-duration":speed}).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
            $(this).addClass(classname)});
}

//TRIVIA GAME OBJECT
var trivia = {
	questions: [],
	currentQ: null,
	gameStart: false,
	numCorrect: 0,
	numIncorrect: 0,
	userGuess: 0,
	init: function(){
		trivia.questions = [];
		get_data();
		trivia.gameDone = false;
		trivia.numCorrect = 0;
		trivia.numIncorrect = 0;
		$(".choices").removeClass("nodisplay");
	},
	display: function(){
		$("#images").empty();
		for (let i = 0; i < 4; i++)
			show_img();
		var rn = Math.floor(Math.random()*trivia.questions.length);
		trivia.currentQ = trivia.questions[rn];
		$("#question").html(trivia.questions[rn].question);
		var arr = []; 
		arr.push(trivia.questions[rn].correct);
		console.log(arr);
		arr = arr.concat(trivia.questions[rn].incorrect);
		arr = arr.shuffle();
		for (let i in arr)
		{
			$("#a"+i).attr("value", arr[i]);
			var lt = "<span id=\"arrow\">&#62;&nbsp;</span>"
			$("#a"+i).html(lt+arr[i]);
		}
		animateonce($(".questionb"), "fadeInUp");
		animateonce($(".choices"), "fadeInUp", "0.2s");
		if (trivia.questions.length <10) get_data();
		trivia.questions.splice(rn, 1);
		$("#res").html("CORRECT: "+trivia.numCorrect+"<br>INCORRECT: "+trivia.numIncorrect);
	},
};

//WHEN DOCUMENT IS READY
$(document).ready(function(){
	get_data();
	getimages(settings);
	getimages(settings2);
	setTimeout(function(){
		for (let i = 0; i < 4; i++)
			show_img();
	}, 1000);


})

//START BUTTON
$("#startBtn").on('click', function(){
	$("#startBtn").addClass("nodisplay");
	$(".game").removeClass("nodisplay");
	$(".choices").removeClass("nodisplay");
	animateonce($("#GameTitle"), "fadeOut", "0s", "0.5s");
	setTimeout(function(){$("#GameTitle").css("visibility", "hidden");}, 500);
	trivia.gameStart = true;
	$("#clockdiv").css({'top':'60px', 'left':'80%'});
	countdown();
	trivia.display();
});


$(".choice").on('click', function(){
	trivia.userGuess = $(this).attr("value");
	if (trivia.userGuess == trivia.currentQ.correct)
	{
		trivia.numCorrect++;
		totaltime += 5;

		var newLine = jQuery('<p> +5 </p>');
		jQuery("#clockdiv2").append(newLine);

		//$("#clockdiv2").html("+5");
		$("#clockdiv2").css("color", "blue");
		$("#clockdiv2").fadeIn();
		animateonce($("#clockdiv2"), "fadeOutDown", "0s", "1s");
		$("#clockdiv2").fadeOut();
		trivia.display();
		setTimeout(function(){jQuery(newLine).remove();}, 500);

	}
	else
	{
		trivia.numIncorrect++;
		totaltime -= 5;
		//$("#clockdiv2").html("-5");

		var newLine = jQuery('<p> -5 </p>');
		jQuery("#clockdiv2").append(newLine);

		$("#clockdiv2").css("color", "red");
		$("#clockdiv2").fadeIn();
		animateonce($("#clockdiv2"), "fadeOutDown", "0s", "1s");
		$("#clockdiv2").fadeOut();
		trivia.display();
		setTimeout(function(){jQuery(newLine).remove();}, 500);

	}
});

var totaltime = 60;
var already = false;
var countdown = function(){
  var intervalt = setInterval(function(){
  	totaltime -= 0.01;
  	$("#clockdiv").html(totaltime.toFixed(1));
  	if (totaltime <=10 && already == false){$("#clockdiv").addClass("redanimation"); already = true;} 
  	 if (totaltime <= 0){
  	 already = false;
  	timeup();
  	clearInterval(intervalt);
  }
  }, 10);

};

var timeup = function(){
	$("#clockdiv").removeClass("redanimation");
	animateonce($(".questionb"), "fadeOut");
	animateonce($(".choices"), "fadeOut");
	setTimeout(function(){	$(".game").addClass("nodisplay")
	$(".choices").addClass("nodisplay")}, 300);
	$(".choices").removeClass("fadeOut");

	$("#clockdiv").html("Game Over!<br>You Scored "+trivia.numCorrect);
	$("#startBtn").html("retry");
	$("#startBtn").removeClass("nodisplay");

	trivia.init();
	totaltime = 60;
	$("#clockdiv").css({'top':'40%', 'left':'37%'});
	animateonce($("#clockdiv"), "fadeIn");
	animateonce($("#startBtn"), "fadeInUp", "0.5s");
};

Array.prototype.shuffle = function() {
    var result = [];
    while( this.length ) {
        var index = Math.floor( this.length * Math.random() );
        result.push( this[ index ] );
        this.splice(index, 1);
    }
    return result;
};

var photourls = [];
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.flickr.com/services/rest/?method=flickr.favorites.getList&api_key=041c318d794f2029894484440d64eedb&user_id=57115590@N03&format=json&nojsoncallback=1&per_page=400",
  "method": "GET",
  "headers": {}
}
var settings2 = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.flickr.com/services/rest/?method=flickr.favorites.getList&api_key=041c318d794f2029894484440d64eedb&user_id=60882352@N05&format=json&nojsoncallback=1&per_page=400",
  "method": "GET",
  "headers": {}
}

var getimages = function(s){
	$.ajax(s).done(function (data) {
	    $.each( data.photos.photo, function( i, gp ) {
			var farmId = gp.farm;
			var serverId = gp.server;
			var id = gp.id;
			var secret = gp.secret;
			photourls.push('https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '_c.jpg');
		});
	});
}

var show_img = function(){
	var $img = $("<img>");
	var imgurl = photourls[Math.floor(photourls.length * Math.random())];
	var rand_t = Math.floor(Math.random()*110)+"%";
	var rand_l = Math.floor(Math.random()*80)+"%";
	$img.attr("src", imgurl);
	$img.css({"position": "absolute", "opacity": "0.5", "left":rand_l, "top":rand_t, "z-index":"-5", "height":"300px", "width":"auto"});

	$img.load(function(){
		$img.fadeIn();
		$("#images").append($img);
		var pos = $img.position();
		console.log(pos);
	});
	
	
}
