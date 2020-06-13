const pool = require('../database');



selectElement('leaveCode', '11')

function selectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}


// get value combo
<select id="mySelect" onchange="myFunction()">
  <option value="Audi">Audi</option>
  <option value="BMW">BMW</option>
  <option value="Mercedes">Mercedes</option>
  <option value="Volvo">Volvo</option>
</select>

<p>When you select a new car, a function is triggered which outputs the value of the selected car.</p>

<p id="demo"></p>

<script>
function myFunction() {
  var x = document.getElementById("mySelect").value;
  document.getElementById("demo").innerHTML = "You selected: " + x;
}
</script>

// get change automatic
Enter your name: <input type="text" id="fname"></input>

<p>When you leave the input field, a function is triggered which transforms the input text to upper case.</p>

<script>
document.getElementById("fname").onchange = function() {myFunction()};

function myFunction() {
  var x = document.getElementById("fname");
  x.value = x.value.toUpperCase();
}
</script>

// get value

First Name: <input type="text" id="myText" value="Mickey"> </input>

<p>Click the button to display the value of the value attribute of the text field.</p>

<button onclick="myFunction()">Try it</button>

<p id="demo"></p>

<script>
function myFunction() {
  var x = document.getElementById("myText").value;
  document.getElementById("demo").innerHTML = x;
}
</script>