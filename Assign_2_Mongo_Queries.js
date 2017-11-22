//
// ------------------------------------------
// FUNCTION 1: most_popular_cuisine
// ------------------------------------------
//
//
//---------------------------------
// 1. What kind of cuisine do New Yorkers prefer? 
//
// Get the total num restaurants and set as var 'total_res'  
var aggRest = db.restaurants.aggregate([
  { "$group" : { "_id" : "restaurant_id", "count" : { "$sum" : 1 } } },
])
var total_rest = aggRest.toArray()[0]["count"]
//
// Group the restaurants by their cuisine style, counting how many are there per group.
// Sort the documents by decreasing order.
// Filter the documents so as to get just the first document
// Use 'total_rest' in percentage calc
db.restaurants.aggregate([
  { "$group" : { "_id" : {"Cuisine" : "$cuisine"}, "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 1 },
  { "$project": {"count":1,"percentage":{"$multiply":[{"$divide":[100,total_rest]},"$total"]}}} 
])
// prints: { "_id" : { "Cuisine" : "American " }, "percentage" : 24.381876256950193 }







//
//---------------------------------
// 2. Which area represents the biggest market opportunity for opening a new restaurant of
//    this kind of cuisine? 
//
// Group the restaurants by their cuisine style, counting how many are there per group.
// Then Sort the documents by decreasing order.
// Finally, filter the documents so as to get just the first document
//---------------------------------
//
db.restaurants.aggregate([
  { "$group" : { "_id" : {"col" : "$cuisine", "bor" : "$borough"}, "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } } 
])


db.restaurants.aggregate([
	{"$group":{"_id":{"cuisine":"$American"},"count":{"$sum":1}}},
	{ "$sort" : { "count" : -1 } } 
])



// precentage attempt - blah
var totalDocument = db.restaurants.count()
db.restaurants.aggregate({"$group":{"_id": "cuisine","count":{"$sum":1}}},
                            {"$project":{"count":1,"percentage":{"$multiply":[{"$divide":[100,totalDocument]},"$count"]}}})


//
//---------------------------------
//  FUNCTION 2: ratio_per_borough_and_cuisine
//---------------------------------
//

// how many restaurants are there per borough
db.restaurants.aggregate([
  { "$group" : { 
    "_id" : "$borough", 
    "count" : { "$sum" : 1 } } },
  { "$sort" : { "count" : -1 } }
]) 

// how many restaurants (of the kind of cuisine we are looking for) are there per borough
db.restaurants.aggregate([
  { "$project" : { 
    "_id" : 0, "Borough" : "$borough", 
    "Cuisine" : {"$cond" : [ {"$eq" : ["$cuisine", "American " ] }, 1, 0]} } },
  { "$group" : { 
    "_id" : "$Borough", 
    "count" : { "$sum" : "$Cuisine" } } },
  { "$sort" : { "count" : -1 } }
]) 


 

