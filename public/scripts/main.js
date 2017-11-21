$(function() {
   
    let apiUrl = '/api/v0.1/';
      
    let postAjaxHelper = function(urlParam,dataObject, successFunc, errorFunc) {

        var data = dataObject;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: urlParam,						
            success: successFunc
        });
    };

    let putAjaxHelper = function(urlParam, dataObject, successFunc, errorFunc) {
        var data = dataObject;

        $.ajax({
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: urlParam,						
            success: successFunc
        });
    }

    let getAjaxHelper = function(urlParam, dataObject, successFunc, errorFunc) {
        var data = dataObject;
        if(!data) {
            $.ajax({
                type: 'GET',
                contentType: 'application/json',
                url: urlParam,						
                success: successFunc
            });

        }
        else {
            $.ajax({
                type: 'GET',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: urlParam,						
                success: successFunc
            });
        }        
    };

    let templateHelper = function(scriptNode, containerNode, data) {
        let compiledTemplate = Handlebars.compile(scriptNode.html());
        let generatedHtml = compiledTemplate(data);
        containerNode.html(generatedHtml);
    };


    let getDeckNames = function() {
        console.log('made it!');
        getAjaxHelper('http://localhost:3000/api/v0.1/decks', {}, function(response,status) {
           let decks = response;
           templateHelper($('#deck-list-template'), $('#deck-list-container'), decks)
           console.log(decks);
        });

    }


    /*let getTestData = function() {
        
        var testData;
        getAjaxHelper('http://localhost:3000/test', {'testParam1': 'some data'}, function(response,status) {
            testData = response;
            var template = $('#testTemplate').html();
            var compiledTemplate = Handlebars.compile(template);
            var generatedHtml = compiledTemplate(testData);
            $('#test-container').html(generatedHtml);
        });
    };*/

    /*let postTestData = function() {
        let testData;
        postAjaxHelper('http://localhost:3000/test', {'testParam1': 'some post data'}, function(response, status) {
            testData = response;
            
        });
    };*/

    $('#deck-create').on('click', function() {
        console.log('clicked the button!');
        let deckName = $('#deck-name').val();
        console.log(deckName);
        putAjaxHelper('http://localhost:3000/api/v0.1/decks', {'deckName':deckName}, function(response, status) {
            let result = response.result;
            getDeckNames();
        })
    });

    getDeckNames();
    //getTestData();
    //postTestData();

  
})