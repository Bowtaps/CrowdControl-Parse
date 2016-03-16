/*
parse.Cloud.define('addTestGroup', function( request, response){
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
*/

/**
 * Fetches updates to a group since the provided timestamp
 */
Parse.Cloud.define('fetchGroupUpdates', function(request, response) {
	
	// Verify request parameters
	var group = request.params.group;
	var userProfile = request.params.userProfile;
	var timestamp = request.params.timestamp;
	
	// Construct and execute queries
	var GroupObject = Parse.Object.extend("Group");
	var UserObject = Parse.Object.extend("CCUser");
	
	var resultArray = new Array();
	
	// Get group matching given parameters
	var GroupQuery = new Parse.Query("Group");
	GroupQuery.get(group).then(function(groupResult) {
			
		// If group has seen an update since then, fetch group members
		if (groupResult.updatedAt > timestamp) {
			resultArray.push(groupResult);
			var groupMembersRelation = groupResult.relation("GroupMembers");
			return groupMembersRelation.query().find();
		} else {
			return null;
		}
	}, function(error) {
		response.error(error);
	}).then(function(memberResults) {

		// Fetch members in relationship
		if (memberResults != null) {
			resultArray = resultArray.concat(memberResults);
		}
		
		// Query for all locations addressed to requested user
		return new Parse.Query("Location").equalTo('To', {
			__type: "Pointer",
			className: "CCUser",
			objectId: userProfile
		}).greaterThan("updatedAt", timestamp).find();
		
	}, function(error) {
		response.error(error);
	}).then(function(locationResults) {
		
		// Add fetched locations to result array
		if (locationResults != null) {
			resultArray = resultArray.concat(locationResults);
		}
		
		// Return results
		response.success(resultArray);
	}, function(error) {
		response.error(error);
	});
});

/*
Parse.Cloud.define('checkPhonenumber', function(request, response){
   
    //var UserObject = Parse.Object.extend('User');
    var query = new Parse.Query("User");
    
    query.equalTo("email", request.params.email);
    
    query.find({
        success: function(results){
            
            response.success("email already in system");
        },
        
        error: function() {
         
          response.error("email not in database");
    }
    });
    
});
*/


Parse.Cloud.define('fetchGroupInformation', function(request, response) {
    
    //set query
    var query = new Parse.Query("Group");  
    
    //perform query
    //query.equalTp("")

    query.find({
        success: function(results){
            response.success();
        },
        error: function() {
            response.error("Fetch Group Information Failed");
        }
        
    })


    
});

Parse.Cloud.define('joinGroup', function(request, response) {
    Parse.Cloud.useMasterKey();
	
    //get params from user
    var group = request.params.group;
    var userProfile = Parse.User.current().get("CCUser");
    
    //fetch().then(function (user){
    //                                                user.get('CCUser');
    //});
    
    
    console.log( "user uid " + userProfile);
    
    // Construct and execute queries
	var GroupObject = Parse.Object.extend("Group");
	//var UserObject = Parse.Object.extend("CCUser");
    var GroupQuery = new Parse.Query("Group");
    
    GroupQuery.equalTo("objectId", GroupObject);
    //get group results
    GroupQuery.find({
        success: function(groupResults){
            
            var relation = groupResults[0].relation("GroupMembers");
            relation.add(userProfile);
            groupResults[0].save();
            
            response.success("found group", groupResults[0]);
            
        }, error: function() {
            response.error("failed to find group");
        }     
    });
    
        
});




Parse.Cloud.beforeSave('leaveGroup', function(request, response) {
	Parse.Cloud.useMasterKey();
	
    //get params from user
    var group = request.params.group;
    var userProfile = Parse.User.current().get("CCUser");
    
    //fetch().then(function (user){
    //                                                user.get('CCUser');
    //});
    
    
    //console.log( "user uid " + userProfile);
    
    // Construct and execute queries
	var GroupObject = Parse.Object.extend("Group");
	//var UserObject = Parse.Object.extend("CCUser");
    var GroupQuery = new Parse.Query("Group");
    
    GroupQuery.equalTo("objectId", GroupObject);
    //get group results
    GroupQuery.find({
        success: function(groupResults){
            
            var relation = groupResults[0].relation("GroupMembers");
            //remove object
            relation.remove(userProfile);
            groupResults[0].save();
            
            response.success("found group", groupResults[0]);
            
        }, error: function() {
            response.error("failed to find group");
        }     
    });

});


