var app=app||{};app.initialize=function(){"use strict";function i(){app.viewModel.ready(!0),e()}function e(){app.viewModel.searchVM.hardcodedLocations().forEach(function(i){i.marker.setMap(app.map)}),app.viewModel.openSearchBar(),app.viewModel.message("My gorillas!",2e3,function(){app.viewModel.hide(),app.userLocations.length>0&&t()})}function t(){app.userLocations.treated()==app.userLocations.length?o():app.userLocations.treated.subscribe(function(i){i==app.userLocations.length&&o()})}function o(){app.viewModel.searchVM.userLocations().forEach(function(i){i.marker.setMap(app.map)}),app.viewModel.openAddBar(),app.viewModel.message("And your sugar canes!",2e3,function(){app.viewModel.hide()})}app.colors={blue:"#00A1DE",green:"#20603D",yellow:"#FAD201"},app.map=app.mapModule(),app.adder=app.adderModule(),app.hardcodedLocations=["Lake Kivu","Gisenyi","Kigali","Ruhengeri","Kigarama","Butare","Kibungo","Kinazi","Nyungwe Forest National Park"],app.userLocations=$.parseJSON(localStorage.getItem("userLocations"))||[],app.viewModelLocations=ko.observableArray(),app.hardcodedLocations.treated=ko.observable(0),app.hardcodedLocations.treated.subscribe(function(e){e==app.hardcodedLocations.length&&i()}),app.adder.addHardcodedLocations(app.hardcodedLocations),app.userLocations.length&&(app.userLocations.treated=ko.observable(0),window.setTimeout(function(){app.adder.addUserLocations(app.userLocations)},400)),app.viewModel=new app.ViewModel,ko.applyBindings(app.viewModel)};var app=app||{};app.adderModule=function(){"use strict";function i(i){i.forEach(function(i){o(i,a,p)})}function e(i,t){var t=t||0;t<i.length&&(o(i[t],a,p),window.setTimeout(function(){e(i,t+1)},500))}function t(i){o(i,n,d)}function o(i,e,t){var o={query:i+" Rwanda"};c.textSearch(o,function(o,a){a==google.maps.places.PlacesServiceStatus.OK?e(o):t(i)})}function a(i){var e=i[0];app.viewModelLocations.push(new app.ViewModelLocation(e))}function n(i){var e=i[0],t=e.name;if(app.hasLocation(t))app.viewModel.message("Already occupied!");else{r(t);var o=new app.ViewModelLocation(e);s(o),app.viewModelLocations.push(o)}}function s(i){i.marker.setMap(app.map),app.viewModel.message("A new sugar cane!")}function r(i){app.userLocations.push(i),localStorage.setItem("userLocations",JSON.stringify(app.userLocations))}function p(i){app.isHardcoded(i);app.oneLocationTreated()}function d(){app.viewModel.message("Not found in Rwanda!")}var c=new google.maps.places.PlacesService(app.map);return{addHardcodedLocations:i,addUserLocations:e,addNewLocation:t}};var app=app||{};app.mapModule=function(){"use strict";var i=new google.maps.LatLng(-1.93082,29.874024),e={center:i,zoom:9,disableDefaultUI:!0,zoomControl:!0,styles:[{featureType:"road.highway",stylers:[{visibility:"off"}]},{featureType:"administrative.country",elementType:"geometry.stroke",stylers:[{color:app.colors.yellow}]}]},t=new google.maps.Map(document.getElementById("map"),e),o=new google.maps.LatLngBounds;t.updateBoundsWithPosition=function(i){o.extend(i),t.fitBounds(o)},t.panToPosition=function(i){t.panTo(i)};var a=app.isMobile?"mousedown":"click";return t.addListener(a,function(){app.viewModel.closeAll()}),t};var app=app||{};app.ViewModelLocation=function(i){"use strict";this.name=i.name,this.position=i.geometry.location,app.map.updateBoundsWithPosition(this.position),this.isHardcoded=app.isHardcoded(this.name),this.highlighted=ko.observable(!1),this.isHardcoded?this.url="img/"+this.name.toLowerCase().replace(/ /g,"-")+".jpg":this.url="",this.buildMarker(),this.infoWindow=new google.maps.InfoWindow({maxWidth:280}),this.queryWikipedia()},app.ViewModelLocation.prototype.toggle=function(){null!==this.marker.getAnimation()?this.close():(app.viewModel.closeAll(),this.open())},app.ViewModelLocation.prototype.close=function(){null!==this.marker.getAnimation()&&(this.marker.setAnimation(null),this.infoWindow.close())},app.ViewModelLocation.prototype.open=function(){this.marker.setAnimation(google.maps.Animation.BOUNCE),this.infoWindow.open(app.map,this.marker),$(".wiki-link").click(function(){this.href&&window.open(this.href)})},app.ViewModelLocation.prototype.buildMarker=function(){this.marker=new google.maps.Marker({position:this.position,icon:this.isHardcoded?"img/gorilla-pin.png":"img/sugar-cane-pin.png",animation:google.maps.Animation.DROP});var i=app.isMobile?"mousedown":"click";this.marker.addListener(i,function(){app.viewModel.hide(),this.toggle()}.bind(this))},app.ViewModelLocation.prototype.queryWikipedia=function(){function i(i){var e=i[2][0],t=i[3][0],o={description:e,url:t};this.setInfoWindow(o),app.viewModel.ready()||app.oneLocationTreated(this.isHardcoded)}function e(){this.setInfoWindow(),app.viewModel.ready()||app.oneLocationTreated(this.isHardcoded)}var t="https://en.wikipedia.org/w/api.php?action=opensearch&search=",o=t+this.name+"&format=json";$.ajax({url:o,dataType:"jsonp",jsonp:"callback"}).done(i.bind(this)).fail(e.bind(this))},app.ViewModelLocation.prototype.setInfoWindow=function(i){this.infoWindow.addListener("closeclick",this.close.bind(this));var e=$(this.infoWindowTemplate(this));this.isHardcoded||e.children("img").remove();var t,o;i&&(t=i.description,o=i.url),t&&t.length>0&&!t.match(/may refer/)?e.children(".wiki-description").text(t):e.children(".wiki-description").remove(),o?e.children(".wiki-link").attr("href",o):e.children(".wiki-link").remove(),this.infoWindow.setContent(e.outerHtml())},app.ViewModelLocation.prototype.infoWindowTemplate=_.template($("#infowindow-template").html());var app=app||{};!function(){"use strict";app.isHardcoded=function(i){for(var e=0,t=app.hardcodedLocations.length;t>e;e++)if(app.hardcodedLocations[e]==i)return!0;return!1},app.hasLocation=function(i){if(app.isHardcoded(i))return!0;for(var e=0,t=app.userLocations.length;t>e;e++)if(app.userLocations[e]==i)return!0;return!1},app.oneLocationTreated=function(i){var e;i?(e=app.hardcodedLocations.treated(),app.hardcodedLocations.treated(e+1)):app.userLocations.length&&(e=app.userLocations.treated(),app.userLocations.treated(e+1))},app.isMobile=window.matchMedia("only screen and (max-width: 760px)").matches}(),function(){"use strict";function i(i){return{init:function(e,t,o,a,n){var s,r;s=function(e,o){o.keyCode===i&&t().call(this,e,o)},r=function(){return{keyup:s}},ko.bindingHandlers.event.init(e,r,o,a,n)}}}jQuery.fn.outerHtml=function(){return jQuery("<div />").append(this.eq(0).clone()).html()},window.matchMedia||(window.matchMedia=function(){var i=window.styleMedia||window.media;if(!i){var e=document.createElement("style"),t=document.getElementsByTagName("script")[0],o=null;e.type="text/css",e.id="matchmediajs-test",t.parentNode.insertBefore(e,t),o="getComputedStyle"in window&&window.getComputedStyle(e,null)||e.currentStyle,i={matchMedium:function(i){var t="@media "+i+"{ #matchmediajs-test { width: 1px; } }";return e.styleSheet?e.styleSheet.cssText=t:e.textContent=t,"1px"===o.width}}}return function(e){return{matches:i.matchMedium(e||"all"),media:e||"all"}}}());var e=13,t=27,o=38,a=40;ko.bindingHandlers.enterKey=i(e),ko.bindingHandlers.escapeKey=i(t),ko.bindingHandlers.upArrow=i(o),ko.bindingHandlers.downArrow=i(a),ko.bindingHandlers.keepFocus={update:function(i,e,t,o,a){var n=ko.unwrap(e());a.$root.searchVM.showMode();n&&$(i).focus()}}}();var app=app||{};app.AddViewModel=function(i){"use strict";this.inputText=i.inputText,this.bar=ko.observable(!1);var e="Add a new place !";this.active=ko.computed(function(){var i=this.bar(),t=this.inputText();return i&&t!=e}.bind(this)),this.onButtonClick=function(){this.active()?this.add():this.bar()?app.viewModel.hide():(app.viewModel.openAddBar(),app.viewModel.inputText(e))}.bind(this),this.add=function(){var i=this.inputText();i.length<=1?app.viewModel.message("Type a location to add!"):app.adder.addNewLocation(i)}};var app=app||{};app.SearchViewModel=function(i){"use strict";this.locations=i.locations,this.inputText=i.inputText,this.messaging=i.messaging,this.hardcodedLocations=ko.computed(function(){return this.locations().filter(function(i){return i.isHardcoded})}.bind(this)),this.userLocations=ko.computed(function(){return this.locations().filter(function(i){return!i.isHardcoded})}.bind(this)),this.bar=ko.observable(!1);var e="Search places in Rwanda";this.showMode=ko.observable("hardcoded"),this.active=ko.computed(function(){var i=this.bar(),t=this.inputText(),o=this.messaging();return i&&t!=e&&!o}.bind(this)),this.onButtonClick=function(){this.bar()?app.viewModel.hide():(app.viewModel.openSearchBar(),this.inputText(e))}.bind(this),this.filterGorillas=function(){"hardcoded"!=this.showMode()&&(this.inputText(""),this.showMode("hardcoded"))}.bind(this),this.filterSugarCanes=function(){"user"!=this.showMode()&&(this.inputText(""),this.showMode("user"))}.bind(this),this.filteredLocations=ko.computed(function(){var i=this.showMode();return"hardcoded"==i?this.hardcodedLocations:this.userLocations}.bind(this)),this.matchingLocations=ko.computed(function(){var i=this.inputText(),e=this.active(),t=this.locations(),o=this.filteredLocations()();if(e){if(""===i)return t.forEach(function(i){i.marker.setVisible(!1)}),o.forEach(function(i){i.marker.setVisible(!0)}),o.length&&this.highlight(o[0]),o;i=i.toLowerCase().trim();var a=o.filter(function(e){var t=new RegExp(".*"+i+".*"),o=t.test(e.name.toLowerCase());return e.marker.setVisible(o),o});return a.length&&this.highlight(a[0]),a}return t.forEach(function(i){i.marker.setVisible(!0)}),t}.bind(this)),this.highlight=function(i){this.locations().forEach(function(i){i.highlighted(!1)}),i.highlighted(!0)}.bind(this),this.highlightNext=function(){for(var i=this.matchingLocations(),e=0,t=i.length-1;t>e;e++)if(i[e].highlighted()){this.highlight(i[e+1]);break}},this.highlightPrevious=function(){for(var i=this.matchingLocations(),e=1,t=i.length;t>e;e++)if(i[e].highlighted()){this.highlight(i[e-1]);break}},this.panToAndOpen=function(){var i=this.highlightedLocation();i?(app.viewModel.hide(),i.toggle(),app.map.panToPosition(i.position)):app.viewModel.message("Not in stock sorry!")}.bind(this),this.highlightedLocation=ko.computed(function(){for(var i=this.matchingLocations(),e=0,t=i.length;t>e;e++)if(i[e].highlighted())return i[e]}.bind(this))};var app=app||{};app.ViewModel=function(){"use strict";this.locations=app.viewModelLocations,this.inputText=ko.observable(""),this.messaging=ko.observable(!1),this.searchVM=new app.SearchViewModel(this),this.addVM=new app.AddViewModel(this),this.ready=ko.observable(!1),this.message=function(i,e,t){var e=e||1500,t=t||function(){};this.messaging(!0),this.inputText(i),window.setTimeout(function(){this.inputText(""),this.messaging(!1),t()}.bind(this),e)},this.click=function(){this.inputText(""),app.viewModel.closeAll()}.bind(this),this.hide=function(){this.searchVM.bar(!1),this.addVM.bar(!1)},this.onEnterKey=function(){this.searchVM.bar()?this.searchVM.panToAndOpen():this.addVM.bar()&&this.addVM.add()},this.onDownArrow=function(){this.searchVM.bar()&&this.searchVM.highlightNext()},this.onUpArrow=function(){this.searchVM.bar()&&this.searchVM.highlightPrevious()},this.closeAll=function(){this.locations().forEach(function(i){i.close()})},this.openSearchBar=function(){this.addVM.bar(!1),this.searchVM.bar(!0)},this.openAddBar=function(){this.searchVM.bar(!1),this.addVM.bar(!0)}};
//# sourceMappingURL=uglified.js.map
