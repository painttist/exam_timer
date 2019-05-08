// alert("Hello World")

function onTimerChange(event) {
  // alert(getElementIndex(element.parentNode));
  // console.log("Timer changed");
  console.log(event.target.value);
}

function getElementIndex (element) {
  return Array.from(element.parentNode.children).indexOf(element);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function updateTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('main-timer-hour').innerHTML = h;
  document.getElementById('main-timer-min').innerHTML = m;
  document.getElementById('main-timer-sec').innerHTML = s;
  var t = setTimeout(updateTime, 500);
}

updateTime();

document.addEventListener("keydown", event => {
  if (event.keyCode == 13) {
    var activeElement = document.activeElement;
    if (activeElement.tagName.toLowerCase() == "input") {
      // Blur the focus when edit finished

      activeElement.blur();

      // console.log("Return inside Input");
    } else {
      // console.log(activeElement.tagName);
    }
  }
});

// Auto Select Input Content On Click
[].forEach.call(document.getElementsByTagName("input"),function(el){
  el.addEventListener("click",function(e){
    this.select();
  });
});

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

[].forEach.call(document.getElementsByClassName("input-time"), function(el){
  el.addEventListener("change",function(e){
    // this.select();
    onTimerChange(e);
  });
});








