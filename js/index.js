'use strict'
// alert("Hello World")

console.log("Version 2.2");

var force12 = true;
var btnForce12 = document.getElementById('btn-toggle-force12');

document.body.onresize = updateDisplayProgress;

var showExtraInfo = false;

function toggleExtraInfo() {
  showExtraInfo = !showExtraInfo;

  updateDisplayProgress();
}

function toggleForce12() {
  force12 = !force12;
  btnForce12.innerHTML = force12 ? 24 : 12;

  Array.from(document.getElementsByClassName('input-time')).forEach(function(el, index){

    if (!el.value) return;
    
    var parsedHM = rawTimeToHM(el.value)
    el.value = getDisplayTime(parsedHM.hour) +":" + getDisplayTime(parsedHM.min);

    pushTimes(index, parsedHM.hour, parsedHM.min);
  });

  updateTime();

  updateDisplayProgress();
}

// Does check force 12
function rawTimeToHM(input) {
  var raw = input.split(":");
  var hour = raw[0];
  if (hour == "") 
    hour = 0;
  var min = -1;

  if (raw.length > 1) {
    min = raw[1];
    if (min == "") 
      min = 0;
  } else {
    min = 0;
  }

  var hm = checkMin(min);

  var min = hm.m;
  
  hour = parseInt(hour) + parseInt(hm.h);
  hour = checkHour(hour);

  return {hour: hour, min: min}
}

function onTimerChange(event) {

  var parsedHM = rawTimeToHM(event.target.value);
  var subjectID = event.target.parentNode.parentNode.getAttribute("subject-id");


  pushTimes(subjectID, parsedHM.hour, parsedHM.min);

  event.target.value = getDisplayTime(parsedHM.hour) + ":" + getDisplayTime(parsedHM.min);

  updateDisplayProgress();
}

function pushTimes(id, h, m) {
  if(subjects) {
    startHour[id] =parseInt(h, 10);
    startMin[id] = parseInt(m, 10);
  }
}

function getElementIndex (element) {
  return Array.from(element.parentNode.children).indexOf(element);
}

function getDisplayTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function checkHour(i) {
  if ((i >= 12) && (force12)) {i = i % 12};
  if ((!force12) && (i < 12)) {i = i + 12};
  i = parseInt(i, 10);
  if (i > 23) {
    i = 23;
  }
  return (i);
}

var currentHour = -1;
var currentMin = -1;
var currentSec = -1;

function checkMin(i) {
  i = parseInt(i, 10);
  if (i >= 60) {
    return {h: Math.floor(i / 60), m: i % 60}
  } else {
    return {h: 0, m: i}
  }
}


var updateTimeTimeOut;

function updateTime() {

  // console.log("Update Time");

  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  h = getDisplayTime(checkHour(h));
  m = getDisplayTime(m);
  s = getDisplayTime(s);

  currentHour = parseInt(h, 10);
  currentMin = parseInt(m, 10);
  currentSec = parseInt(s, 10);
  document.getElementById('main-timer-hour').innerHTML = h;
  document.getElementById('main-timer-min').innerHTML = m;

  if (document.getElementById('main-timer-sec').innerHTML != s) {
    // console.log("Actually Changed Second");
    updateDisplayProgress();
  }

  document.getElementById('main-timer-sec').innerHTML = s;

  updateTimeTimeOut = setTimeout(updateTime, 100);
}

document.addEventListener("keydown", event => {
  if (event.keyCode == 13) {
    var activeElement = document.activeElement;
    if (activeElement.tagName.toLowerCase() == "input") {
      // Blur the focus when edit finished

      activeElement.blur();
  
    } else {
  
    }
  }
});

// Auto Select Input Content On Click
var lastActive;
var subjects = [];
var startHour =[];
var startMin = [];
// var finishedEditing = false;

var lastActiveLegends;

function addAutoSelectOnInput() {
  [].forEach.call(document.getElementsByTagName("input"),function(el){
    el.removeEventListener("click", addAutoSelectOnInputClick);
    el.addEventListener("click", addAutoSelectOnInputClick);
  });
}

function addAutoSelectOnInputClick(ev) {
  if (lastActive != this){
    this.select();
    lastActive = this;
  }
}

addAutoSelectOnInput();

// [].forEach.call(document.getElementsByClassName("timer-legends"),function(el){
//   el.addEventListener("click", function(ev) {
//     if (lastActiveLegends != this) {
//       if (lastActiveLegends)
//         targetPCloseEditElem(lastActiveLegends);
//     }
//     lastActiveLegends = this;
//   });
// });

document.addEventListener("click", function(ev) {
  var currentLegends = getClosestParent(ev.target, '.timer-legends');
  var timerDuration = getClosestParent(ev.target, '#timer-duration');


  if (currentLegends != null) {
    if ((lastActiveLegends) && (lastActiveLegends != currentLegends))
      targetPCloseEditElem(lastActiveLegends);
    targetPToggleEditElem(currentLegends);
    lastActiveLegends = currentLegends;
  } else if (timerDuration != null) {
    return;
  } else {
    if (lastActiveLegends)
      targetPCloseEditElem(lastActiveLegends);
  }

  // }

  // if ((getClosestParent(ev.target, '.timer-legends') == null)
  //   && (timerDuration == null)) {
  //   if (lastActiveLegends)
  //       targetPCloseEditElem(lastActiveLegends);
  // } else {
  //   if ((lastActiveLegends != currentLegends) && (timerDuration == null)) {
  //     if (lastActiveLegends) {
  //       targetPCloseEditElem(lastActiveLegends);
  //     }
  //     targetPToggleEditElem(currentLegends);
  //   }
  //   lastActiveLegends = currentLegends;
  // }
});

function getClosestParent(elem, selector) {

  // Element.matches() polyfill
  if (!Element.prototype.matches) {
      Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function(s) {
              var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                  i = matches.length;
              while (--i >= 0 && matches.item(i) !== this) {}
              return i > -1;
          };
  }

  // Get the closest matching element
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches( selector ) ) return elem;
  }
  return null;

};

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

// addEventListenerToClassName("click", "timer-legends", targetPPToggleEdit);
// addEventListenerToClassName("blur", "input-duration", targetPPRemoveEdit);
addEventListenerToClassName("change", "input-time", onTimerChange);

function targetPPToggleEdit(event) {
  
  event.target.parentNode.parentNode.classList.toggle('edit');
}

function targetPToggleEditElem(elem) {
  
  elem.parentNode.classList.toggle('edit');
}

function targetPPRemoveEdit(event) {
  event.target.parentNode.parentNode.classList.remove('edit');
}

function targetPCloseEditElem(elem) {
  
  elem.parentNode.classList.remove('edit');
}

function removeEventListenerFromClassName(event, className, func) {
  [].forEach.call(document.getElementsByClassName(className), function(el){
    el.removeEventListener(event, func);
  });
}

function addEventListenerToClassName(event, className, func) {
  [].forEach.call(document.getElementsByClassName(className), function(el){
    el.addEventListener(event, func);
  });
}

/* Function to open fullscreen mode */

document.onfullscreenchange = onFullScreenChange;

function onFullScreenChange (ev) {
  toggleExpandIcon();
}

function toggleFullScreen() {
  if (document.fullscreenElement) {

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
    // resetZoom();

  } else {
    var body = document.body;

    if (body.requestFullscreen) {
      body.requestFullscreen();
    } else if (body.mozRequestFullScreen) { /* Firefox */
      body.mozRequestFullScreen();
    } else if (body.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) { /* IE/Edge */
      body.msRequestFullscreen();
    }

    // zoomIn();
  } 
}

function toggleExpandIcon() {
  var btnFullScreen = document.getElementById("btn-fullscreen")
  if (document.fullscreenElement) {
    btnFullScreen.setAttribute("uk-icon", "shrink");
  } else {
    btnFullScreen.setAttribute("uk-icon", "expand");
  }
}


function pushNewSubject() {
  subjects.push(0);
  startHour.push(-1);
  startMin.push(-1);
}


// [].forEach.call(document.getElementById("timer-container").children, function(e) {
//   if (e.classList.contains("subject")) {

//     subjects.push(e);
//     startHour.push(-1);
//     startMin.push(-1);
//   }
// });

const timerColors = ["#e67e22", "#2ecc71", "#3498db", "#9b59b6"];

function updateDisplayProgress() {
  [].forEach.call(document.getElementsByClassName("timer"), function(el){
    var subjectID = el.parentNode.parentNode.getAttribute("subject-id");

    var title = document.getElementById('subject-title-'+subjectID);
    // console.log(title);
    // var endInfo = title.children[2];

    var selectBox = el.parentNode.children[0].children[0];
    // console.log(selectBox.selectedIndex);
    var endInfo = title.children[2];

    if (!showExtraInfo) {
      endInfo.innerHTML = "";
    } else if (endInfo.innerHTML == "") {
      endInfo.innerHTML = 'End     <span class="uk-text-normal">1: --:--</span>     <span class="uk-text-normal">2: --:--</span>';
    }

    // console.log(selectBox.selectedIndex, endInfo.children);
    var endInfoChild = endInfo.children[selectBox.selectedIndex];
    // console.log(endInfoChild.innerHTML);


    var endLabel = selectBox.value;
    // console.log(endLabel);

    var minElapsed = 0;

    // if (finishedEditing)

    var inputDuration = el.children[1].children[1];
    var inputReading = el.children[1].children[3];
    

    var timerLegends = el.children[0];

    var legendReading = timerLegends.children[0];
    var legendStart = timerLegends.children[1];
    var legend30 = timerLegends.children[2];
    var legend5 = timerLegends.children[3];

    var legendEnd = el.parentNode.children[2].children[0];

    var duration = 0;
    var reading = 0;
    if (inputDuration.value) {
      duration = parseInt(inputDuration.value, 10);
    }

    if (inputReading.value) {
      reading = parseInt(inputReading.value, 10);
    } else {
      reading = 0;
    }

    duration += reading;

    var offset = 6; // The 5px padding + the 1px border to the left

    // Legends
    if (subjects)
    if ((startHour[subjectID] >= 0) && (startMin[subjectID] >=0) 
      && (currentHour >= 0) && (currentMin >= 0) && (currentSec >= 0)
      && (duration >= 30)) {
      var sh = parseInt(startHour[subjectID]);
      var sm = parseInt(startMin[subjectID]);
      var shtxt = getDisplayTime(sh);
      var smtxt = getDisplayTime(sm);
      minElapsed = (currentHour - startHour[subjectID]) * 60 + currentMin - startMin[subjectID] + currentSec / 60;

      // console.log("Min Elapsed", minElapsed);

      var hm = checkMin(sm + reading);
      var hr = parseInt(sh) + parseInt(hm.h, 10);
      var mr = parseInt(hm.m, 10);
      hr = getDisplayTime(hr);
      mr = getDisplayTime(mr);
      // legendStart.innerHTML = " Start "+hr+":"+mr;
      populateLegendStart(legendStart, hr, mr);

      var hm = checkMin(sm + duration - 30);
      var h30 = parseInt(sh) + parseInt(hm.h, 10);
      var m30 = parseInt(hm.m, 10);
      h30 = getDisplayTime(h30);
      m30 = getDisplayTime(m30);
      // legend30.setAttribute("data-before", "30-Min "+h30+":"+m30+" ");
      // legend30.setAttribute("data-before", "30-Min ");
      // legend30.setAttribute("data-after", h30+":"+m30);

      populateLegend30(legend30, h30, m30);

      var hm = checkMin(sm + duration - 5);
      var h5 = parseInt(sh) + parseInt(hm.h, 10);
      var m5 = parseInt(hm.m, 10);
      h5 = getDisplayTime(h5);
      m5 = getDisplayTime(m5);

      populateLegend5(legend5, h5, m5);
      // legend5.setAttribute("data-before", "5-Min "+h5+":"+m5+" ");

      var hm = checkMin(sm + duration);
      var hfull = parseInt(sh) + parseInt(hm.h, 10);
      var mfull = parseInt(hm.m, 10);
      hfull = getDisplayTime(hfull);
      mfull = getDisplayTime(mfull);
      // legendEnd.innerHTML = "End  "+hfull+":"+mfull;

      populateLegendEnd(legendEnd, hfull, mfull);

      populateEndInfo(endInfoChild, hfull, mfull, endLabel);

    } else {
      if (duration <= 30)
        duration = 60;
      minElapsed = 0;
      populateLegendStart(legendStart, '--', '--');
      // Left Arrow 
      populateLegend30(legend30, '--', '--');
      // Right Arrow 
      populateLegend5(legend5, '--', '--');

      populateLegendEnd(legendEnd, '--', '--');

      populateEndInfo(endInfoChild, '--', '--', endLabel);
    }

    // var comStyle = window.getComputedStyle(timerLegends);
    // var width = parseFloat(comStyle.getPropertyValue("width"), 10);
    
    // var offsetWidth = timerLegends.offsetWidth;

    var totalLegendWidth = timerLegends.clientWidth;

    // console.log(totalLegendWidth);

    // console.log(subjectID, "Reading", reading, "Duration", duration);
    var legendReadingPerc = (reading) / duration;
    var legendReadingWidth = legendReadingPerc * totalLegendWidth;

    if (legendReadingWidth <= 0) {
      legendReading.classList.add('gone');

    } else {
      legendReading.classList.remove('gone');
    }

    // console.log(legendReadingWidth);
    legendReading.style.width = legendReadingWidth - offset + "px";

    var legendStartPerc = (duration - 30 - reading) / duration;
    var legendStartWidth = legendStartPerc * totalLegendWidth;

    legendStart.style.width = legendStartWidth - offset + "px";
    // cssWidthMinusPx(legendStart, 12);

    var legend30Perc = 25 / duration;
    var legend30Width = legend30Perc * totalLegendWidth;

    legend30.style.width = legend30Width - offset + "px";
    // cssWidthMinusPx(legend30, 12);

    // console.log(legend30Perc);

    legend30.style.setProperty("--tag-padding-right", (legend30Width + 5)+ "px");

    // var legend5Perc = 1 - 
    var legend5Perc = 1 - legendReadingPerc - legendStartPerc - legend30Perc;
    var legend5Width = totalLegendWidth - legendReadingWidth - legendStartWidth - legend30Width;
    legend5.style.width = legend5Width - offset + "px";

    legend5.style.setProperty("--tag-padding-right", (legend5Width + 5)+ "px");

    var percent = minElapsed / duration;

    // legendReadingPerc - legendStartPerc - legend30Perc - legend5Perc


    var color1Perc = percent - legendReadingPerc;
    var color2Perc = color1Perc - legendStartPerc;
    var color3Perc = color2Perc - legend30Perc;
    var color4Perc = color3Perc - legend5Perc;

    var primaryColorIndex = 0;

    if (color1Perc >= 0) {
      // Change primary Color Index
      primaryColorIndex = 1;
    }

    if (color2Perc >= 0) {
      primaryColorIndex = 2;
    }

    if (color3Perc >= 0) {
      primaryColorIndex = 3;
    }

    // console.log("-----------------------------")

    // console.log(Math.floor(hundredize(color1Perc)), Math.floor(hundredize(color2Perc)),
    //   Math.floor(hundredize(color3Perc)),
    //   Math.floor(hundredize(color4Perc)));
    // console.log(percent);

    var primaryColor = timerColors[primaryColorIndex];
    var shadowColor = ColorLuminance(primaryColor, -0.3);

    var bgColor = "#ddd"

    var shadowWidth = 0.2;

    percent = hundredize(percent);

    timerLegends.style.backgroundImage = "linear-gradient(90deg, "
      +primaryColor+" 0%, "
      +primaryColor+" "+(percent)+"%, "
      +shadowColor+" "+(percent)+"%, "
      +bgColor+" "+(percent + shadowWidth)+"%, "
      +bgColor+" "+(percent + shadowWidth)+"%, "
      +bgColor+" 100%)";
  });
}

function hundredize(percent) {
  return percent*100;
}

function populateLegendStart(elem, h, m) {
  elem.innerHTML = "< Reading <div class='timer-legend-time'>"+h+":"+m+"</div>";
}

function populateLegend30(elem, h, m) {
  elem.setAttribute("data-before", "30 MIN >");
  elem.setAttribute("data-after", h+":"+m);
}

function populateLegend5(elem, h, m) {
  elem.setAttribute("data-before", "5 MIN >");
  elem.setAttribute("data-after", h+":"+m);
}

function populateLegendEnd(elem, h, m) {
  elem.innerHTML = "<div class='timer-legend-end-small'>End </div><div class='timer-legend-end-large'>"+h+":"+m+"</div>";
}

function populateEndInfo(elem, hsl, msl, label) {
  if (elem) {
    elem.innerHTML = label+"  "+hsl+":"+msl;
  }
}

updateTime();
updateDisplayProgress();
pushNewSubject();

function addSubject(){
  var newSubjectID = subjects.length;
  var n2html = '<div id="subject-title-'+newSubjectID+'" subject-id="'+newSubjectID+'" class="subject uk-flex-auto uk-flex uk-card uk-card-body uk-card-xsmall uk-card-default uk-margin-small-top uk-flex"> <input type="text" class="uk-flex-none uk-width-medium uk-input uk-card-title uk-text-bold" placeholder="Subject Name"> <div class="uk-flex-none uk-width-auto uk-flex uk-flex-middle uk-input uk-text-large uk-text-bold"> Start  <input tabindex='+(newSubjectID+1)+' class="input input-time uk-text-normal uk-width-small uk-flex-none uk-input" type="text" placeholder="00:00"> </div><div class="uk-flex-1 uk-flex uk-flex-middle uk-input uk-text-large uk-text-bold"> End     <span class="uk-text-normal">--:--</span>     <span class="uk-text-normal">--:--</span></div><button class="btn-subject-delete uk-flex-none uk-flex uk-flex-middle uk-padding-small uk-padding-remove-vertical" uk-icon="minus-circle" onclick="deleteSubject(this)"></button></div><div id="subject-levels-'+newSubjectID+'" subject-id="'+newSubjectID+'" class="levels-card uk-card uk-card-body uk-card-xsmall uk-card-default uk-margin-small-top"> <div class="level uk-flex-middle uk-flex-auto uk-flex uk-margin-small-bottom"> <div class="uk-text-medium uk-flex-none uk-width-auto uk-flex uk-flex-left uk-flex-column"> <select class="uk-input uk-text-bold level-label"> <option selected>SL</option> <option>HL</option> </select> </div><div class="timer uk-width-expand uk-flex-1 uk-flex uk-flex-wrap uk-flex-middle"> <div class="uk-width-1-1 timer-legends uk-width-expand uk-flex uk-flex-middle uk-text"> <div id="timer-legend-reading" class="timer-legend"></div><div id="timer-legend-start" class="timer-legend"> Start 00:00</div><div id="timer-legend-30" class="timer-legend"> </div><div id="timer-legend-5" class="timer-legend"> </div></div><div id="timer-duration" class="uk-width-1-1 uk-flex uk-flex-baseline"> <div class="uk-flex-none">Duration (min):</div><input type="text" class="input-duration uk-flex-none uk-width-auto uk-input" placeholder="60" value="60"> <div class="uk-flex-none">Reading Time (min):</div><input type="text" class="input-duration uk-flex-1 uk-input" placeholder="5" value="5"> </div></div><div class="uk-width-auto uk-flex-none uk-flex uk-flex-left"> <div class="uk-text-left level-label-end level-label">End</div></div></div><div class="level uk-flex-middle uk-flex-auto uk-flex"> <div class="uk-text-medium uk-flex-none uk-width-auto uk-flex uk-flex-left uk-flex-column"> <select class="uk-input uk-text-bold level-label"> <option>SL</option> <option selected>HL</option> </select> </div><div class="timer uk-width-expand uk-flex-1 uk-flex uk-flex-wrap uk-flex-middle"> <div class="uk-width-1-1 timer-legends uk-width-expand uk-flex uk-flex-middle uk-text"> <div id="timer-legend-reading" class="timer-legend"></div><div id="timer-legend-start" class="timer-legend"> Start 00:00</div><div id="timer-legend-30" class="timer-legend"> </div><div id="timer-legend-5" class="timer-legend"> </div></div><div id="timer-duration" class="uk-width-1-1 uk-flex uk-flex-baseline"> <div class="uk-flex-none">Duration (min):</div><input type="text" class="input-duration uk-flex-none uk-width-auto uk-input" placeholder="120" value="120"> <div class="uk-flex-none">Reading Time (min):</div><input type="text" class="input-duration uk-flex-1 uk-input" placeholder="5" value="5"> </div></div><div class="uk-width-auto uk-flex-none uk-flex uk-flex-left"> <div class="uk-text-left level-label-end level-label">End</div></div></div></div>';
  // var nhtml = '<div subject-id="'+newSubjectID+'" class="subject uk-flex-auto uk-flex uk-card uk-card-body uk-card-xsmall uk-card-default uk-margin-small-top uk-flex"> <input type="text" class="uk-flex-none uk-width-auto uk-input uk-card-title uk-text-bold" placeholder="Subject Name"> <div class="uk-flex-1 uk-flex uk-flex-middle uk-input uk-text-large uk-text-bold"> Starts <input tabindex='+(newSubjectID+1)+' class="input input-time uk-width-auto uk-flex-none uk-input" type="text" placeholder="00:00"> </div></div><div subject-id="'+newSubjectID+'" class="levels-card uk-card uk-card-body uk-card-xsmall uk-card-default uk-margin-small-top"> <div class="level uk-flex-auto uk-flex uk-margin-small-bottom"> <div class="uk-width-expand uk-flex-none uk-width-small uk-flex uk-flex-left uk-flex-column"> <select class="uk-input uk-text-bold level-label"> <option selected>Standard Level</option> <option>Higher Level</option> </select> <div class="uk-text-left uk-input level-label">End</div></div><div class="timer uk-width-expand uk-flex-1 uk-flex uk-flex-wrap uk-flex-middle"> <div class="uk-width-1-1 timer-legends uk-width-expand uk-flex uk-flex-middle uk-text"> <div id="timer-legend-reading" class="timer-legend"></div><div id="timer-legend-start" class="timer-legend"> Start 00:00</div><div id="timer-legend-30" class="timer-legend"> </div><div id="timer-legend-5" class="timer-legend"> </div></div><div id="timer-duration" class="uk-width-1-1 uk-flex uk-flex-baseline"> <div class="uk-flex-none">Duration (min):</div><input type="text" class="input-duration uk-flex-none uk-width-auto uk-input" placeholder="60" value="60"> <div class="uk-flex-none">Reading Time (min):</div><input type="text" class="input-duration uk-flex-1 uk-input" placeholder="5" value="5"> </div></div></div><div class="level uk-flex-auto uk-flex uk-margin-small-bottom"> <div class="uk-width-expand uk-flex-none uk-width-small uk-flex uk-flex-left uk-flex-column"> <select class="uk-input uk-text-bold level-label"> <option>Standard Level</option> <option selected>Higher Level</option> </select> <div class="uk-text-left uk-input level-label">End</div></div><div class="timer uk-width-expand uk-flex-1 uk-flex uk-flex-wrap uk-flex-middle"> <div class="uk-width-1-1 timer-legends uk-width-expand uk-flex uk-flex-middle uk-text"> <div id="timer-legend-reading" class="timer-legend"></div><div id="timer-legend-start" class="timer-legend"> Start 00:00</div><div id="timer-legend-30" class="timer-legend"> </div><div id="timer-legend-5" class="timer-legend"> </div></div><div id="timer-duration" class="uk-width-1-1 uk-flex uk-flex-baseline"> <div class="uk-flex-none">Duration (min):</div><input type="text" class="input-duration uk-flex-none uk-width-auto uk-input" placeholder="120" value="120"> <div class="uk-flex-none">Reading Time (min):</div><input type="text" class="input-duration uk-flex-1 uk-input" placeholder="5" value="5"> </div></div></div></div>';
  // var html = '<div subject-id="'+newSubjectID+'" class="subject uk-flex-auto uk-flex uk-card uk-card-body uk-card-xsmall uk-card-default uk-margin-small-top uk-flex"> <input type="text" class="uk-flex-none uk-width-auto uk-input uk-card-title uk-text-bold" placeholder="Subject Name"> <div class="uk-flex-1 uk-flex uk-flex-middle uk-input uk-text-medium uk-text-bold"> Starts <input tabindex='+(newSubjectID+1)+' class="input input-time uk-width-auto uk-flex-none uk-input" type="text" placeholder="00:00"> </div></div><div subject-id="'+newSubjectID+'" class="levels-card uk-card uk-card-body uk-card-xsmall uk-card-default uk-margin-small-top"> <div class="level uk-flex-auto uk-flex uk-margin-small-bottom"> <div class="uk-width-expand uk-flex-none uk-width-small uk-flex uk-flex-left uk-flex-column"> <select class="uk-input uk-text-bold level-label"> <option selected>Standard Level</option> <option>Higher Level</option> </select> <div class="uk-text-left uk-input level-label">End</div></div><div class="timer uk-width-expand uk-flex-1 uk-flex uk-flex-wrap uk-flex-middle"> <div class="uk-width-1-1 timer-legends uk-width-expand uk-flex uk-flex-middle uk-text"> <div id="timer-legend-start" class="timer-legend"> Start 00:00</div><div id="timer-legend-30" class="timer-legend"> </div><div id="timer-legend-5" class="timer-legend"> </div></div><div id="timer-duration" class="uk-width-1-1 uk-flex uk-flex-baseline"> <div class="uk-flex-none">Duration (min):</div><input type="text" class="input-duration uk-flex-1 uk-input" placeholder="60" value="60"> </div></div></div><div class="level uk-flex-auto uk-flex uk-margin-small-bottom"> <div class="uk-width-expand uk-flex-none uk-width-small uk-flex uk-flex-left uk-flex-column"> <select class="uk-input uk-text-bold level-label"> <option>Standard Level</option> <option selected>Higher Level</option> </select> <div class="uk-text-left uk-input level-label">End</div></div><div class="timer uk-width-expand uk-flex-1 uk-flex uk-flex-wrap uk-flex-middle"> <div class="uk-width-1-1 timer-legends uk-width-expand uk-flex uk-flex-middle uk-text"> <div id="timer-legend-start" class="timer-legend"> Start 00:00</div><div id="timer-legend-30" class="timer-legend"> </div><div id="timer-legend-5" class="timer-legend"> </div></div><div id="timer-duration" class="uk-width-1-1 uk-flex uk-flex-baseline"> <div class="uk-flex-none">Duration (min):</div><input type="text" class="input-duration uk-flex-1 uk-input" placeholder="120" value="120"> </div></div></div></div>';
  document.getElementById("timer-container").insertAdjacentHTML('beforeend', n2html);
  
  removeEventListenerFromClassName('change', 'input-time', onTimerChange);
  addEventListenerToClassName("change", "input-time", onTimerChange);

  addAutoSelectOnInput();

  // clearTimeout(updateTimeTimeOut);
  // updateTime();
  updateDisplayProgress();

  // removeEventListenerFromClassName("click", "timer-legends", targetPPToggleEdit);
  // addEventListenerToClassName("click", "timer-legends", targetPPToggleEdit);

  // removeEventListenerFromClassName("blur", "input-duration", targetPPToggleEdit);
  // addEventListenerToClassName("blur", "input-duration", targetPPToggleEdit);
  
  pushNewSubject();
}

var currentZoomPercent = 100;
var zoomPopUpTimeOut;

function zoomIn() {
  currentZoomPercent += 10;
  document.getElementById("main").style.setProperty('zoom', currentZoomPercent + '%');
  zoomPopup();
  updateDisplayProgress();
}

function zoomOut() {
  currentZoomPercent -= 10;
  document.getElementById("main").style.setProperty('zoom', currentZoomPercent + '%');
  zoomPopup();
  updateDisplayProgress();
}

function resetZoom() {
  currentZoomPercent = 100;
  document.getElementById("main").style.setProperty('zoom', currentZoomPercent + '%');
  updateDisplayProgress();
}

function zoomPopup() {
  document.getElementById("zoom-pop-up").innerHTML = "Zoom: " + currentZoomPercent + "%";
  document.getElementById("zoom-pop-up").classList.remove('uk-invisible');
  // document.getElementById("zoom-pop-up").classList.add('uk-animation-fade');

  clearTimeout(zoomPopUpTimeOut);
  zoomPopUpTimeOut = setTimeout(function(){
    document.getElementById("zoom-pop-up").classList.add('uk-invisible');
    // document.getElementById("zoom-pop-up").classList.remove('uk-animation-fade');
  }, 300)
}

function deleteSubject(elem) {

  var parent = elem.parentNode;
  var sibling = parent.nextElementSibling;
  sibling.parentNode.removeChild(sibling);

  parent.parentNode.removeChild(parent);
}

function ColorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
}


// function cssWidthMinusPx(el, px) {
//   var comStyle = window.getComputedStyle(el);
//   var offsetWidth = comStyle.getPropertyValue("offsetWidth");
//   el.style.width = (offsetWidth - px) +"px";
// }




