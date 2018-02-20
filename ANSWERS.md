## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. We give the server the name of the database and pass that into the UserController constructor
1. We pass the user ID into the method. It then checks the Mongo Document userCollection for any Documents that have a matching ID. It then iterates through this to pick out a single user, or returns null if none are found.
1. We pass in the filter parameters we want. Those parameters get added to the filterDoc document and at the end of the method, we use the .find(filterDoc) to pass the find the parameters which returns a document with the users we want.
1. Documents are a Bson object that is used by Mongo to store the data and easily transfer to different types. We're them as a storage medium for the data before we send the data to the client
1. The UserControllerSpec.clearAndPopulateDb clears and populates the database being used for testing. It is populated with specific users for testing before every test.
1. UserControllerSpec.getUsersWhoAre37() tests that the server returns the proper number of users with a specific age and returns the proper users. We test it by passing it a HashMap with the queries we want and then check which users it returns and how many.
1. UserRequestHandler takes in the information from the Server, and checks if it's a BasicDBObject. If it is, it typecasts it to that, and extracts the object's information (name, age, etc.). It then passes it to UserController which creates a Document object and puts the extracted information into it. From here, the document is inserted into the database.
