Parse.Cloud.define('addTestGroup', function( request, response){
    var Group = Parse.Object.extend('Group');
    var relation = Group.relation('Users');

    var query = new Parse.Query('Parse.User');
    

    query.equalTo('User', ParseUser.current())
    query.limit(10);
    query.find({
        sucess: function(results){
            if(results.length > 0){
                for( var i = 0; i < results.length; i++)
                {
                    var object = results[i];
                    Group.addUnique('groupMembers', relation);
                }
            }
            else{
                responce.error('users not avalable');
            }
            group.save();
            
        },
        error: function(error){
        response.error('and error orrcured');
    }
    });
});
