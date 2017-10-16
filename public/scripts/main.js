$(function() {
    
      
    var postAjaxHelper = function(urlParam,dataObject, successFunc, errorFunc) {

        var data = dataObject;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: urlParam,						
            success: successFunc
        });
    };

    var getAjaxHelper = function(urlParam, dataObject, successFunc, errorFunc) {
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

    var getTestData = function() {
        
        var testData;
        getAjaxHelper('http://localhost:3000/test', {'testParam1': 'some data'}, function(response,status) {
            testData = response;
            console.log(response);
        });
    };

    getTestData();


  
})