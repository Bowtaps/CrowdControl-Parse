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
/*
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
	var GroupQuery = new Parse.Query(GroupObject);
	GroupQuery.get(group).then(function(groupResult) {
			
		// If group has seen an update since then, fetch group members
		if (groupResult.updatedAt < timestamp) {
			resultArray.push(groupResult);

			// Fetch members in relationship
			var groupMembersRelation = groupResult.relation("GroupMembers");
			return groupMembersRelation.query().find();
		} else {
			response.success(resultArray);
		}
	},

	// Handle errors
	function(error) {
		response.error('Unable to match group');
	}).then(function(memberResults) {

		// Add group members to result array and return success
		resultArray = resultArray.concat(memberResults);
		response.success(resultArray);
	},

	// Handle errors
	function(error) {
		response.error('Unable to get group members');
	});
	
});*/


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