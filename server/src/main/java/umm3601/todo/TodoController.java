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
        Document categoriesSummary = null;
        Document ownersSummary = null;

        // overall todos complete
        float TodosComplete = todoCollection.count(filterDoc);
        float TodosTotal = todoCollection.count();
        summary.add(Document.parse("{ percentTodosComplete: " + (TodosComplete/TodosTotal) + "}"));
        //summary.add(Document.parse("{\n" +
        //    "                    percentTodosComplete:" + percentToDosComplete + "}"));


        // todos complete by owner and category
        //ownersSummary = percentComplete("owner");
        //categoriesSummary = percentComplete("category");

/*
        DistinctIterable<Document> ownerNames = todoCollection.distinct("owner",Document.class);

        String ownerName;
        float ownerPercent;
        float ownerTotal;
        float ownerComplete;
        for(Document ownerDoc : ownerNames){
            filterDoc = new Document();
            ownerName = ownerDoc.get("owner").toString();
            filterDoc.append("owner", ownerName);

            ownerTotal = todoCollection.count(filterDoc);

            filterDoc.append("status", true);
            ownerComplete = todoCollection.count(filterDoc);

            ownerPercent = ownerComplete/ownerTotal;

            ownersSummary.put(ownerName, ownerPercent);
        }
        */

        /*
        List<Document> testTodos = new ArrayList<>();

        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Chris\",\n" +
            "                    status: false,\n" +
            "                    category: \"homework\",\n" +
            "                    body: \"add an underscore to make that error you had for a whole day go away\"\n" +
            "                }"));
            */

        //summary.append("categoriesPercentComplete", categoriesSummary);
        //summary.append("ownersPercentComplete", ownersSummary);


        return JSON.serialize(summary);
        //return summary.toJson();
    }

    public Document percentComplete(String fieldName){
        Document returnSummary = null;
        Document filterDoc = new Document();
        DistinctIterable<String> Names = todoCollection.distinct(fieldName,String.class);

        String Name;
        float Percent;
        float Total;
        float Complete;
        for(String Doc : Names){
            filterDoc = new Document();
            Name = "Fry";
            filterDoc.append(fieldName, Name);

            Total = todoCollection.count(filterDoc);

            filterDoc.append("status", true);
            Complete = todoCollection.count(filterDoc);

            Percent = Complete/Total;

            returnSummary.put(Name, Percent);
        }

        return returnSummary;
    }
}

