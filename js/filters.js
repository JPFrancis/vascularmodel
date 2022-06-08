function getFilterMenu()
{
  var filterCheckboxes = document.getElementById("filterCheckboxes")
  var categoryName = getCategoryName();

  var allHooks = []

  for(var i = 0; i < categoryName.length; i++)
  {
    var div = document.createElement('div');
    div.classList.add("cd-filter-block")

    var h4 = document.createElement('h4');
    h4.classList.add("closed");
    h4.textContent = categoryName[i];

    if (getNTimesPerCategory(categoryName[i]) == 2)
    {
      var output = generateDropDownMenu(categoryName[i]);
    }
    else
    {
      var output = generateCheckboxUl(categoryName[i]);
    }

    var insideContent = output[0]
    var hooks = output[1]

    div.appendChild(h4);
    div.appendChild(insideContent);
    filterCheckboxes.appendChild(div);
    allHooks.push(hooks);
  }

  for (var i = 0; i < allHooks.length; i++)
  {
    addHooks(allHooks[i]);
  }
}

function addHooks(hooks) {
  for (var i = 0; i < hooks.length; i++) {
    $("#" + hooks[i]).change(function() {applyFilters();});
  }
}

function generateDropDownMenu(categoryName)
{
  var div = document.createElement("div")
  div.classList.add("cd-filter-content");
  div.classList.add("cd-select");
  div.classList.add("cd-filters");
  div.classList.add("list");

  var select = document.createElement("select")
  select.classList.add("filter")
  select.setAttribute("id", "select-" + categoryName)
  //select.classList.add("dropbtn");

  var option = document.createElement("option")
  option.value = "none";
  option.textContent = "Select One";
  select.appendChild(option);
  option.classList.add("dropdown-content");

  var hooks = ["select-" + categoryName];

  //separate for Age
  if(categoryName == "Age")
  {
    var checkboxNameArray = ["Adult", "Pediatric"]
  }
  else{
    var checkboxNameSet = new Set();
  
    for(var i = 0; i < data.length; i++)
    {
      checkboxNameSet.add(data[i][categoryName])
    }

    var checkboxNameArray = Array.from(checkboxNameSet);
    checkboxNameArray.sort();
  }

  //checkboxNameArray.length should = 2
  for (var i = 0; i < checkboxNameArray.length; i++) {
      var newOption = generateOptions(checkboxNameArray[i]);
      select.appendChild(newOption);
  }
  
  div.appendChild(select);

  return [div, hooks]
}

function generateOptions(optionName)
{
  var option = document.createElement("option")
  option.value = optionName;

  option.textContent = optionName;
  option.classList.add("dropdown-content");
  return option;
}

function generateCheckboxUl(categoryName)
{
  var ul = document.createElement("ul")
  ul.classList.add("cd-filter-content");
  ul.classList.add("cd-filters");
  ul.classList.add("list");
  
  var checkboxNameSet = new Set();
  
  for(var i = 0; i < data.length; i++)
  {
    checkboxNameSet.add(data[i][categoryName])
  }

  var checkboxNameArray = Array.from(checkboxNameSet);
  checkboxNameArray.sort();

  var hooks = []
  
  for (var i = 0; i < checkboxNameArray.length; i++) {
      var newLi = generateCheckboxLi(checkboxNameArray[i]);
      ul.appendChild(newLi);
      hooks.push("checkbox-" + checkboxNameArray[i])
  }

  return [ul, hooks];
}

function generateCheckboxLi(checkboxName) {
  let li = document.createElement('li');
  
  let input = document.createElement('input');
  input.classList.add("filter");
  input.setAttribute("data-filter", checkboxName);
  input.type = "checkbox";
  input.setAttribute("id", "checkbox-" + checkboxName);

  let label = document.createElement('label');
  label.classList.add("checkbox-label");
  label.setAttribute("for", "checkbox-" + checkboxName)
  label.textContent = checkboxName;

  li.appendChild(input);
  li.appendChild(label);

  return li;
}

function getNTimesPerCategory(categoryName)
{
  var nTimesRepeat = 0;

  var categoryNames = []
  var allCategoryNames = []

  for (const [key, value] of Object.entries(data[0])) {
    allCategoryNames.push(key);
  }
    
  for(var i = allCategoryNames.indexOf("Images"); i < allCategoryNames.indexOf("Size"); i++)
  {
    categoryNames.push(allCategoryNames[i])
  }
  
  if (categoryName == "Age")
  {
    nTimesRepeat = 2;
  }
  else if (categoryNames.includes(categoryName))
  {
    nTimesRepeat = 1;
  }
  else
  {
    var noRepeatArray = new Set();
    for(var dI = 0; dI < data.length; dI++)
    {
      noRepeatArray.add(data[dI][categoryName])
    }
    nTimesRepeat = noRepeatArray.size;
  }

  return nTimesRepeat;
}

function getNTimes()
{
  var nTimesRepeat = []
  var listOfNames = getAllCategories();

  //skips Name and Size
  for(var i = 1; i < listOfNames.length - 1; i ++)
  {
    nTimesRepeat.push(getNTimesPerCategory(listOfNames[i]));
  }
  
  return nTimesRepeat;
}

function applyFilters(){
  var filterApplied = false
  curIndex = 0;
  var filteredData = data;
  /*
  var IDs = fillIDs();
  var keys = fillKeys();
  
  var categoryName = getCheckboxName();*/
  var nTimes = getNTimes();/*
  var category = []

  for(var i = 0; i < categoryName.length; i++)
  {
    category = fillCategory(category, nTimes[i], categoryName[i]);
  }*/

  var filterOutput;

  var titles = getFilterTitles();

  for(var t = 0; t < titles.length; t++){
    
    if (getNTimesPerCategory(titles[t]) == 2)
    {
      filterOutput = dropDownFilter(titles[t], filteredData)
      filteredData = filterOutput[0]
      filterApplied = filterApplied || filterOutput[1]
    }
    else {
      var whichToKeep = []
      //if a box is checked in the category
      if (isChecked(titles[t]))
      {    
        for (var i = 0;  i < filteredData.length; i++) {
          whichToKeep.push(false);
        }

        for(var i = 0; i < nTimes[t]; i++)
        {
          IDs = checkboxNamesPerCategory(titles[t], false)
          keys = checkboxNamesPerCategory(titles[t], true)
          filterOutput = checkboxFilter("checkbox-" + IDs[i], titles[t], keys[i], filteredData, whichToKeep)
          whichToKeep = filterOutput[0]
          filterApplied = filterApplied || filterOutput[1]
        }
      }
      else{
        for (var i = 0;  i < filteredData.length; i++) {
          whichToKeep.push(true);
        }
      }
      //whichToKeep and filteredData should have the same length
      filteredData = updatedFilteredData(whichToKeep, filteredData);
    }
  }

  filterOutput = applySearchFilter(filteredData);
  filteredData = filterOutput[0]
  filterApplied = filterApplied || filterOutput[1]

  removeContent();
  scrollToTop();
  populate(filteredData);
  updateCounter(filterApplied, filteredData);
  if (filteredData.length == 0) {
    document.getElementById('error-msg').style.transitionDuration = '0.3s';
    document.getElementById('error-msg').style.opacity = 1;
  }
  else {
    document.getElementById('error-msg').style.transitionDuration = '0s';
    document.getElementById('error-msg').style.opacity = 0;
  }
}

function updatedFilteredData(whichToKeep, filteredData)
{
  var updatedFilteredData = []

  for (var i = 0 ; i < filteredData.length; i++)
  {
    if (whichToKeep[i])
    {
      updatedFilteredData.push(filteredData[i]);
    }
  }

  return updatedFilteredData;
}

function isChecked(title)
{
  IDs = checkboxNamesPerCategory(title, false)

  for(var i = 0; i < IDs.length; i++)
  {
    if (document.getElementById("checkbox-" + IDs[i]).checked)
    {
      return true;
    }
  }  
}

function checkboxNamesPerCategory(categoryName, isKey)
{
  var checkboxNames = []
  var checkboxNameSet = new Set();
          
  for(var dI = 0; dI < data.length; dI++)
  {
    checkboxNameSet.add(data[dI][categoryName])
  }

  var checkboxNames = Array.from(checkboxNameSet);

  if (!isKey && checkboxNames.includes("1"))
  {
    checkboxNames = [categoryName]
  }
  return checkboxNames;
}

function fillCategory(category, n, categoryName)
{
  for(var i = 0; i < n; i++)
  {
    category.push(categoryName);
  }
  
  return category;
}

function dropDownFilter(categoryName, partialData){

  var valueToSearch = document.getElementById("select-" + categoryName).value.toLowerCase()

  if(valueToSearch == 'none')
  {
    return [partialData, false];
  }
  else
  {
    var filteredData = []
    var arrayLength = partialData.length;

    for (var i = 0; i < arrayLength; i++) {
      for (const [key, value] of Object.entries(partialData[i])) {
        var category = key.toLowerCase();
        var option = value.toLowerCase();
        
        if (category == categoryName.toLowerCase()) {
          var pushValue = false;

          if (option == valueToSearch) 
          {
            pushValue = true; 
          }

          //different for Age
          if(category.toLowerCase() == "age")
          {
            if (valueToSearch == "pediatric" && parseInt(option) < 18) {
              pushValue = true;
            }
            else if (valueToSearch == "adult" && parseInt(option) >= 18){
              pushValue = true;
            }
          }

          if (pushValue)
            filteredData.push(partialData[i]);
        }
      }
    }

    return [filteredData, true];
  }
}

function checkboxFilter(checkboxID, category, key, partialData, whichToKeep){
  
  if (document.getElementById(checkboxID).checked)
  {
    var arrayLength = partialData.length;
  
    for (var i = 0; i < arrayLength; i++) {
      if (partialData[i][category] == key) {
        whichToKeep[i] = true;
      }
    }
  
    return [whichToKeep, true];
  }

  //nothing checked; returns same array as input
  return [whichToKeep, false]
}


function applySearchFilter(partialData){
    var valueToSearch = document.getElementById('search-field').value.toLowerCase()
  
    if (valueToSearch == '')
    {
      return [partialData, false]
    }
    else
    {
      var filteredData = new Set()
      var arrayLength = partialData.length;
      var allCategories = getAllCategories();
      var categoriesWith1s = []
  
      for(var i = 0; i < allCategories.length; i++)
      {
        if (getNTimesPerCategory(allCategories[i]) == 1)
        {
          categoriesWith1s.push(allCategories[i])
        }
      }
      
  
      for (var i = 0; i < arrayLength; i++) {
        for (const [key, value] of Object.entries(partialData[i])) {
          var category = key.toLowerCase();
          var input = value.toLowerCase();
  
          if (!categoriesWith1s.includes(category))
          {
            if (input.includes(valueToSearch)) {
              filteredData.add(partialData[i])
            }
          }
          else
          {
            if (category == valueToSearch && input == '1') {
              filteredData.add(partialData[i])
            }
          }
  
        }
      }
  
      filteredData = Array.from(filteredData);
  
      return [filteredData, true];
    }
  }
  
  function getOptionsUnderCategory(categoryName)
  {
    var optionsSet = new Set();
            
    for(var dI = 0; dI < data.length; dI++)
    {
      optionsSet.add(data[dI][categoryName])
    }
  
    var options = Array.from(optionsSet);
  
    return options;
  }

  