package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.DistinctIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }

    public String getTodos(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetOwner = queryParams.get("owner")[0];
            filterDoc = filterDoc.append("owner", targetOwner);
        }

        if (queryParams.containsKey("body")) {
            String targetContent = (queryParams.get("body")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("body", contentRegQuery);
        }

        FindIterable<Document> mathchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(mathchingTodos);
    }

    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }

    public String getTodoSummary() {
        Document filterDoc = new Document();
        filterDoc = filterDoc.append("status", true);

        List<Document> summary = new ArrayList<>();

        // overall todos complete
        float TodosComplete = todoCollection.count(filterDoc);
        float TodosTotal = todoCollection.count();
        summary.add(Document.parse("{ percentTodosComplete:" + ((TodosComplete/TodosTotal)*100) + "}"));

        // todos complete by owner and category
        summary.add(Document.parse("{ categoriesPercentComplete : " + percentComplete("category") + "}"));
        summary.add(Document.parse("{ ownersPercentComplete : " + percentComplete("owner") + "}"));


        return JSON.serialize(summary);
        //return summary.toJson();
    }

    public String percentComplete(String fieldName){
        String returnSummary = "{ ";
        Document filterDoc = new Document();
        DistinctIterable<String> DINames = todoCollection.distinct(fieldName,String.class);
        Iterator<String> Names = DINames.iterator();

        String Name;
        float Total;
        float Complete;
        while (Names.hasNext()){
            filterDoc = new Document();
            Name = Names.next();
            filterDoc.append(fieldName, Name);

            Total = todoCollection.count(filterDoc);

            filterDoc.append("status", true);
            Complete = todoCollection.count(filterDoc);

            returnSummary = returnSummary + "\"" + Name + "\"" + ": " + ((Complete/Total)*100);

            if(Names.hasNext()){
                returnSummary = returnSummary + ", ";
            }

        }

        returnSummary = returnSummary + "}";
        //System.out.println(returnSummary);

        return returnSummary;
    }

    public String addNewTodo(String owner, String category, String body) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", false);
        newTodo.append("category", category);
        newTodo.append("body", body);

        try {
            todoCollection.insertOne(newTodo);
            ObjectId id = newTodo.getObjectId("_id");
            System.err.println("Successfully added new todo [_id=" + id + ", owner=" + owner + ", category=" + category + " body=" + body + ']');
            // return JSON.serialize(newTodo);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}

