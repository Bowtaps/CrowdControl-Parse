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
		
		// Query for all conversatiosn in the group
		return new Parse.Query("Conversation").equalTo('Group', resultArray[0]).greaterThan("updatedAt", timestamp).find();
	}, function(error) {
		response.error(error);
	}).then(function(conversationResults) {
		
		// Add fetched conversations to result array
		if (conversationResults != null) {
			resultArray = resultArray.concat(conversationResults);
		}
		
		// Return results
		response.success(resultArray);
	}, function(error) {
		response.error(error);
	});
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
	
    //get group results
    GroupQuery.get(group, {
        success: function(groupResult){
          	
			// Found group, add user to it and save
			var relation = groupResult.relation("GroupMembers");
			relation.add(userProfile);

			groupResult.save({
				success: function() {
					response.success(groupResult)
				}, error: function() {
					response.error("failed to join group");
				}
			});
            
        }, error: function() {
            response.error("failed to find group");
        }     
    });
    
        
});



Parse.Cloud.define('leaveGroup', function(request, response) {
	Parse.Cloud.useMasterKey();
	
    //get params from user
    var group = request.params.group;
    var userProfile = Parse.User.current().get("CCUser");
    
    // Construct and execute queries
	var GroupObject = Parse.Object.extend("Group");
	//var UserObject = Parse.Object.extend("CCUser");
    var GroupQuery = new Parse.Query("Group");
    
    //get group results
    GroupQuery.get(group, {
        success: function(groupResult){
            
            var relation = groupResult.relation("GroupMembers");
            //remove object
            relation.remove(userProfile);
			
            groupResult.save({
				success: function() {
					response.success(groupResult);
				}, error: function() {
					reponse.error("failed to remove user from group", groupResult);
				}
			});
            
        }, error: function() {
            response.error("failed to find group");
        }     
    });

});



Parse.Cloud.define('fetchNotifications', function(request, response) {
	
	// Get current user's profile
	var userProfile = Parse.User.current().get("CCUser");
	
	var resultArray = new Array();
	
	// Construct and execute queries
	var invitationQuery = new Parse.Query("Invitation");
	invitationQuery.equalTo('Recipient', userProfile);
	invitationQuery.include('Sender');
	invitationQuery.include('Group');
	
	// Execute query
	invitationQuery.find().then(function(invitationResult) {
		
		// Append fetched invitations to result set
		if (invitationResult != null) {
			resultArray.concat(invitationResult);
		}
		
		response.success(resultArray);
		
	}, function(error) {
		response.error(error);
	});
});
