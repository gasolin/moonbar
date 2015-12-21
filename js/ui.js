// init start
var searchfield = document.getElementById('search');
var suggestionsSelect = document.getElementById('suggestions-select');
var suggestionTags = document.getElementById('suggestion-tags');
var tip = document.getElementById('tip');

searchfield.focus();
// init end

// when press enter key, run the first suggestion
searchfield.addEventListener('keydown', function(evt) {
  switch (evt.keyCode) {
    case 13: //enter
      if (suggestionsSelect.hasChildNodes()) {
        clickHandler({
          target: suggestionsSelect.childNodes[0]
        });
      }
      break;
      // Navigation hacks
      case 40: //down
        if(suggestionTags.hasChildNodes()) {
          //console.log('has tags' + suggestionTags.childNodes[0].id);
          suggestionTags.childNodes[0].focus();
        }
        break;
  }
});

// Navigation hacks
suggestionTags.addEventListener('keydown', function(evt) {
  switch (evt.keyCode) {
    case 38: //up
      console.log('focus to input field');
      searchfield.focus();
      break;
  }
});

// Navigation hacks
suggestionsSelect.addEventListener('keydown', function(evt) {
  switch (evt.keyCode) {
    case 13: //enter
      clickHandler({
        target: evt.target
      });
      break;
  }
});

searchfield.addEventListener('input', function() {
  var [verb, restTerm, results] = huxian.parse(searchfield.value, searchPool);
  resetUI();
  renderLabels(suggestionTags, verb, results);

  // show default verb tags
  if (searchfield.value.length == 0) {
    return;
  }
  if (results.length != 0) {
    // render suggestions
    results.forEach(function(result) {
      var noun = reverseMap[result];
      var li = document.createElement('li');
      li.id = result;
      li.dataset.type = noun.type;
      li.classList.add('focusable');
      switch (noun.type) {
        case 'open':
          //suggestionsSelect.innerHTML += '<li>Open ' + noun.name + '</li>';
          li.textContent = 'Open ' + noun.name;
          li.addEventListener('click', clickHandler);
          suggestionsSelect.appendChild(li);
          break;
        default: //'search'
          //suggestionsSelect.innerHTML += '<li>Search ' + restTerm + ' with ' + noun.name + '</li>';
          // TOOD: excape the term
          li.dataset.key = encodeURI(restTerm);
          li.textContent = 'Search ' + restTerm + ' with ' + noun.name;
          li.addEventListener('click', clickHandler);
          suggestionsSelect.appendChild(li);
          break;
      }
    });
  } else { // search through default search provider
    //suggestionsSelect.innerHTML = '<li>' + 'Search ' + searchfield.value + '</li>';
    var restTerm = searchfield.value;
    var li = document.createElement('li');
    li.id = defaultSearchProvider;
    li.dataset.type = 'search';
    li.classList.add('focusable');
    li.dataset.key = encodeURI(restTerm);
    li.textContent = 'Search ' + restTerm;
    li.addEventListener('click', clickHandler);
    suggestionsSelect.appendChild(li);
  }

  // make everything navigatable
  $('.focusable').SpatialNavigation();
});

renderLabels(suggestionTags);
