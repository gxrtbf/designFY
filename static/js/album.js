$(function(){
	$.ajax({
        type: 'POST',
        url: "../albumfile/search/",
        data: {
        	'cover': 'needCover',
        },
        success: function(dataset){
        	ht = ''
        	for (var i=0; i<=dataset.length-1; i++) {
        		ht += '<div class="albumitem">'
				ht += '<div class="imageitem">'
				ht += '<a href="../albumItem/'
				ht += dataset[i].title
				ht += '"><img src="'
				ht += dataset[i].cover
				ht += '" style="width: 100%;height: 100%;"><p>'
				ht += dataset[i].title
				ht += '</p></a></div></div>'
        	}
        	document.getElementById("albumlist").innerHTML = ht;
        }
    });
});