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

var cuisine_name = "";
var ratio_cuisine = 0;
var borough = "";
var count_rest_boro = 0;
var count_rest_with_cuisin = 0;
var ratio_borough = 0;

var aggRest = db.restaurants.aggregate([
  { "$group" : { "_id" : "restaurant_id", "count" : { "$sum" : 1 } } },
])
var total_rest = aggRest.toArray()[0]["count"]
//
// Group the restaurants by their cuisine style, counting how many are there per group.
// Sort the documents by decreasing order.
// Filter the documents so as to get just the first document
// Use 'total_rest' in percentage calc
var aggRest2 = db.restaurants.aggregate([
  { "$group" : { "_id" : "$cuisine", "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 1 },
  { "$project": {"count":1,"percentage":{"$multiply":[{"$divide":[100,total_rest]},"$total"]}}} 
])
cuisine_name = aggRest2.toArray()[0]["_id"]
ratio_cuisine = aggRest2.toArray()[0]["percentage"]


//
//---------------------------------
// 2. Which area represents the biggest market opportunity for opening a new restaurant of
//    this kind of cuisine? 
//
//---------------------------------
//
db.restaurants.aggregate([
  { "$group" : { "_id" : {"col" : "$cuisine", "bor" : "$borough"}, "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } } 
])
//
//
db.restaurants.aggregate([
	{"$group":{"_id":{"cuisine":"$American"},"count":{"$sum":1}}},
	{ "$sort" : { "count" : -1 } } 
])
//
//
//---------------------------------
//  FUNCTION 2: ratio_per_borough_and_cuisine
//---------------------------------
//
// how many restaurants are there per borough
// { "_id" : "Staten Island", "count" : 969 }
var aggBoro1 =db.restaurants.aggregate([
  { "$group" : { 
    "_id" : "$borough", 
    "count" : { "$sum" : 1 } } },
  { "$sort" : { "count" : 1 } },
  { "$skip" : 1 },
  { "$limit" : 1 },
]) 
count_rest_boro = aggBoro1.toArray()[0]["count"];



var aggBoro2 = db.restaurants.aggregate([
  { "$project" : { 
    "_id" : 0, "Borough" : "$borough", 
    "Cuisine" : {"$cond" : [ {"$eq" : ["$cuisine", cuisine_name ] }, 1, 0]} } },
  { "$group" : { 
    "_id" : "$Borough", 
    "count" : { "$sum" : "$Cuisine" } } },
  { "$sort" : { "count" : 1 } },
  { "$skip" : 1 },
  { "$limit" : 1 },
  { "$project": {"count":1,"percentage":{"$multiply":[{"$divide":[100, count_rest_boro]},"$count"]}}} 
]) 
ratio_borough = aggBoro2.toArray()[0]["percentage"];
borough = aggBoro2.toArray()[0]["_id"];
//
//
//
//
print("1. The kind of cuisine with more restaurants in the city is", cuisine_name, "(with a", ratio_cuisine, "percentage of restaurants of the city)")
//
//
//
//
print ("2. The borough with smaller ratio of restaurants of this kind of cuisine is", borough, "(with a", ratio_borough, "percentage of restaurants of this kind)")
