//
// ------------------------------------------
// FUNCTION 1: most_popular_cuisine
// ------------------------------------------
//
//
//---------------------------------
// 1. What kind of cuisine do New Yorkers prefer? 
//
// Group the restaurants by their cuisine style, counting how many are there per group.
// Then Sort the documents by decreasing order.
// Finally, filter the documents so as to get just the first document
//---------------------------------
//
db.restaurants.aggregate([
  { "$group" : { "_id" : {"col" : "$cuisine"}, "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  {"$project":{"count":1,"percentage":{"$multiply":[{"$divide":[100,totalDocument]},"$total"]}}},
  { "$limit" : 1 }
])
var total_num = "$total"
print(total_num)

{"$project":{"count":1,"percentage":{"$multiply":[{"$divide":[100,totalDocument]},"$count"]}}},

// prints: { "_id" : { "col" : "American " }, "total" : 12366 }


// 2. Get the total amount of restaurants
// { "_id" : "restaurant_id", "count" : 25359 }
db.restaurants.aggregate([
  { "$group" : { "_id" : "restaurant_id", "count" : { "$sum" : 1 } } },
])



print(totalRestaurants)



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


 

