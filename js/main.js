// <li class="mix color-2 check2 radio2 option2"><img src="img/vmr-images/0003_0001.png" alt="Image 2"></li>

function addClickListener(model) {
  $('#' + model['Name']  + "_details").click(function() {greetingText(model);});
  $('#' + model['Name']).click(function() {updatedSelectedList(model);});
}

function updatedSelectedList(model)
{
  selectedModels[data.indexOf(model)] = !selectedModels[data.indexOf(model)];
  if(selectedModels[data.indexOf(model)])
  {
    var element = document.getElementById(model['Name'] + "_isSelected");
    element.classList.add("selected")
  }
  else
  {
    var element = document.getElementById(model['Name'] + "_isSelected");
    element.classList.remove("selected")
  }

  updateSelectedCounter();
}

function greetingText(data)
{
  viewingModel = data['Name']
  $('.details-text').scrollTop(0);
  $('#modal-greeting')[0].innerText = 'You are viewing ' + data['Name'] + '.\nHere are the details:'
  $('.modalDialog').css({"opacity":"1", "pointer-events": "auto"})
  // $('.cd-main-content').css({"overflow-y":"hidden", "height": "%100", "padding-right": "15px"});
  // $('.html').css({"margin": "0", "height": "100%", "overflow-y": "hidden", "padding-right": "15px"})
  $('.html').css({"height": "100%", "overflow-y": "hidden", "padding-right": "7px"})
  $('.body').css({"height": "100%", "overflow-y": "hidden", "padding-right": "7px"})
    
  var details = []
  var categoryName = getCategoryName();

  for(var i = 0; i < categoryName.length; i++)
  {
    details += categoryName[i] + ": " + data[categoryName[i]] + '\n'
  }

  var fdrs = ['Images', 'Paths', 'Segmentations', 'Models', 'Meshes', 'Simulations']
  for (var i = 0; i < fdrs.length; i++) {
    if (data[fdrs[i]] == '1') {
      details = details + fdrs[i] + ' available: yes'
    }
    else {
      if (data[fdrs[i]] == '0') {
        details = details + fdrs[i] + ' available: no'
      }
    }
    if (i != fdrs.length-1)
      details = details + '\n'
  }
  var size = parseInt(data['Size']) / 1000000
  $('.details-text')[0].value = details
  $('#modal-closure')[0].innerText = 'The size of this project is ' + size.toFixed(2) + ' Mb (' + (size/1000).toFixed(2) + ' Gb).'
}

function generateContent(modelData) {
  var div = document.createElement("div");
  div.classList.add("col-md-3");
  div.classList.add("col-sm-12");

  var divModelImage = document.createElement("div");
  divModelImage.classList.add("model-image");
  divModelImage.classList.add("animate");
  divModelImage.setAttribute("id",modelData['Name'] + "_isSelected");

  if(selectedModels[data.indexOf(modelData)])
  {
    divModelImage.classList.add("selected");
  }

  let aWrap = document.createElement("a");
  aWrap.classList.add("a-img")
  // aWrap.setAttribute("id",modelData['Name']);

  let detailsImg = document.createElement("i");
  detailsImg.classList.add("fa-solid");
  detailsImg.classList.add("fa-pink");
  detailsImg.classList.add("fa-magnifying-glass");
  detailsImg.classList.add("top-left");
  detailsImg.setAttribute("id",modelData['Name'] + "_details");

  let innerImg = document.createElement("img");
  innerImg.src = 'img/vmr-images/' + modelData['Name'] + '.png'
  innerImg.alt = modelData['Name']
  innerImg.setAttribute("id",modelData['Name']);

  aWrap.appendChild(innerImg)
  aWrap.appendChild(detailsImg)
  divModelImage.appendChild(aWrap);
  div.appendChild(divModelImage);

  return div
}

function removeContent() {
  var modelList = document.getElementById("model-gallery")
  while (modelList.firstChild) {
    modelList.removeChild(modelList.firstChild);
  }
}

function populate(dataArray, num_images = 24) {
  var modelList = document.getElementById("model-gallery")
  var arrayLength = dataArray.length;
  var ubound = arrayLength;
  if (curIndex + num_images < arrayLength) {
    ubound = curIndex + num_images
  }
  for (var i = curIndex; i < ubound; i++) {
    var newContent = generateContent(dataArray[i]);
    modelList.appendChild(newContent);
    addClickListener(dataArray[i])
  }
  curIndex = ubound;
}

$(document).ready(function($){
  $.ajax({
    type: "GET",
    url: "dataset/dataset.csv",
    dataType: "text",
    async: false,
    success: function(fdata) {
      data = $.csv.toObjects(fdata);
      // we shuffle array to make it always different
      data.sort(() => (Math.random() > .5) ? 1 : -1);
    }
  });

  checkWidth();
  // create copy of data
  filteredData = data;
  initializeSelectedModels();
  updateFilterAppliedCounter(false, data)
  updateSelectedCounter()
  getViewSelected();
  getFilterMenu();
  errorMessage();

  populate(data);

  //open/close lateral filter
  $('.cd-filter-trigger').on('click', function(){
    triggerFilter(true);
  });
  $('.cd-filter .cd-close').on('click', function(){
    triggerFilter(false);
  });

  $('#apply-btn').on('click', function(){
    applyFilters();
    triggerFilter(false);
  });

  // this function is called whenever "Filters" is pressed. It applies the
  // "filter-is-visible" class to all elements in elementsToTrigger. The behavior
  // filter-is-visible is determined in style_dataset.css
  function triggerFilter($bool) {
    var elementsToTrigger = $([$('.cd-filter-trigger'), $('.cd-filter'), $('.cd-tab-filter'), $('.cd-gallery')]);
    elementsToTrigger.each(function(){
      $(this).toggleClass('filter-is-visible', $bool);
    });
  }

  //close filter dropdown inside lateral .cd-filter
	$('.cd-filter-block h4').on('click', function(){
		$(this).toggleClass('closed').siblings('.cd-filter-content').slideToggle(300);
	})

  // we apply the filter when enter is pressed on the search field
  $('#search-field').keydown(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      // if (e.ctrlKey) {
      applyFilters()
      triggerFilter(false);
      return true;
    }
  });

});

$('.close-button-modal').click(function() {
  $('.modalDialog').css({"opacity":"0", "pointer-events": "none"})
  $('.html').css({"overflow-y":"auto", "height": "", "padding-right": "0px"})
  $('.body').css({"overflow-y":"auto", "height": "", "padding-right": "0px"})
});

$('.download-button-modal').click(function() {
  $('.modalDialog').css({"opacity":"0", "pointer-events": "none"})
  $('.html').css({"overflow-y":"auto", "height": "", "padding-right": "0px"})
  $('.body').css({"overflow-y":"auto", "height": "", "padding-right": "0px"})
  // download tracking
  console.log(data['Name']);
  window.open('svprojects/' + viewingModel + '.zip')
  console.log('svprojects/' + viewingModel + '.zip')
  gtag('event', 'download_' + viewingModel, {
      'send_to': 'G-YVVR1546XJ',
      'event_category': 'Model download',
      'event_label': 'test',
      'value': '1'
  });
});

function checkWidth() {
    if (screen.width >= 769 && (document.documentElement.clientWidth >= 769)) {
        if (smallScreen) {
          smallScreen = false;
          updateFilterAppliedCounter(lastFapplied, lastFdata);
          updateSelectedCounter();
        }
    }
    else {
      if (!smallScreen) {
        smallScreen = true;
        updateFilterAppliedCounter(lastFapplied, lastFdata);
        updateSelectedCounter();
      }
    }
}

function initializeSelectedModels()
{
  selectedModels = new Array(data.length);
  selectedModels.fill(false);
}

$(window).ready(checkWidth);
$(window).resize(checkWidth);

function updateFilterAppliedCounter(fApplied, fData) {
  lastFdata = fData;
  lastFapplied = fApplied;
  if (smallScreen) {
    if (fApplied) {
      document.getElementById('model-counter').textContent = fData.length + '/' + data.length + ' models'
    }
    else {
      document.getElementById('model-counter').textContent = + fData.length + '/' + data.length + ' models'
    }
  }
  else {
    if (fApplied) {
      document.getElementById('model-counter').textContent = "Filters applied: " + fData.length + '/' + data.length + ' models'
    }
    else {
      document.getElementById('model-counter').textContent = "Filters not applied: " + fData.length + '/' + data.length + ' models'
    }
  }
}

function updateSelectedCounter()
{
  var count = selectedModels.filter(value => value === true).length;

  if (smallScreen) {
    document.getElementById('selected-counter').textContent = count + " selected";
  }
  else {
    document.getElementById('selected-counter').textContent = count + " models selected";
  }
}

function getViewSelected()
{
  var placeinHTML = document.getElementById('view-selected');
  placeinHTML.textContent = "View Selected";
}

window.addEventListener('scroll', () => {
  var footerHeight = $('#contact-section').height();
  // var footerHeight = document.getElementById("contact-section").height()
  var padding = 50;
  if (window.scrollY + window.innerHeight + footerHeight + padding>= document.documentElement.scrollHeight) {
    populate(filteredData, 8);
  }
});

function scrollToTop() {
  window.scrollTo(0, 0);
}

/*****************************************************
  MixItUp - Define a single object literal
  to contain all filter custom functionality
*****************************************************/
var buttonFilter = {
    // Declare any variables we will need as properties of the object
    $filters: null,
    groups: [],
    outputArray: [],
    outputString: '',

    // The "init" method will run on document ready and cache any jQuery objects we will need.
    init: function(){
      var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.

      self.$filters = $('.cd-main-content');
      self.$container = $('.cd-gallery ul');

      self.$filters.find('.cd-filters').each(function(){
          var $this = $(this);

        self.groups.push({
            $inputs: $this.find('.filter'),
            active: '',
            tracker: false
        });
      });

      self.bindHandlers();
    },

    // The "bindHandlers" method will listen for whenever a button is clicked.
    bindHandlers: function(){
      var self = this;

      self.$filters.on('click', 'a', function(e){
          self.parseFilters();
      });
      self.$filters.on('change', function(){
        self.parseFilters();
      });
    },

    parseFilters: function(){
      var self = this;

      // loop through each filter group and grap the active filter from each one.
      for(var i = 0, group; group = self.groups[i]; i++){
        group.active = [];
        group.$inputs.each(function(){
          var $this = $(this);
          if($this.is('input[type="radio"]') || $this.is('input[type="checkbox"]')) {
            if($this.is(':checked') ) {
              group.active.push($this.attr('data-filter'));
            }
          } else if($this.is('select')){
            group.active.push($this.val());
          } else if( $this.find('.selected').length > 0 ) {
            group.active.push($this.attr('data-filter'));
          }
        });
      }
      self.concatenate();
    },

    concatenate: function(){
      var self = this;

      self.outputString = ''; // Reset output string

      for(var i = 0, group; group = self.groups[i]; i++){
          self.outputString += group.active;
      }

      // If the output string is empty, show all rather than none:
      !self.outputString.length && (self.outputString = 'all');

      // Send the output string to MixItUp via the 'filter' method:
    if(self.$container.mixItUp('isLoaded')){
        self.$container.mixItUp('filter', self.outputString);
    }
    }
}

$("#view-selected").click(function() {
  
  var display = []
  for(var i = 0; i < data.length; i++)
  {
    if(selectedModels[i])
    {
      display.push(data[i])
    }
  }
  
  removeContent();
  scrollToTop();
  curIndex = 0;
  populate(display);

  if (display.length == 0) {
    errorMessage(true, false)
  }
  else {
    errorMessage(false, false)
  }
});

function errorMessage(isOn, isFilter)
{
  var errorMsg = document.getElementById('error-msg');
  
  //determines which message is showing
  if(isFilter)
  {
    errorMsg.textContent = "It looks like there are no results matching the filters! Please consider using less restrictive rules.";
  }
  else
  {
    errorMsg.textContent = "It looks like no models were selected!";
  }

  //whether or not the error message is visible/displayed
  if(isOn)
  {
    errorMsg.style.transitionDuration = '0.3s';
    errorMsg.style.opacity = 1;
  }
  else
  {
    errorMsg.style.transitionDuration = '0s';
    errorMsg.style.opacity = 0;
  }

}