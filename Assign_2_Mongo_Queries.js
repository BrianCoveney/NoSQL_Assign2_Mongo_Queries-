//
var total_num_rest = 0; 
var cuisine_name = "";
var ratio_cuisine = 0;
var borough = "";
var count_rest_boro = 0;
var count_rest_with_cuisin = 0;
var ratio_borough = 0;
//
//
//*********************************
// 1. Most popular cuisine
//*********************************
//
//---------------------------------
// 1.1. Grouping by 'restaurant_id' and get a total count of restaurants
//---------------------------------
var aggRest = db.restaurants.aggregate([
  { "$group" : { "_id" : "restaurant_id", 
                 "count_restaurants" : { "$sum" : 1 } } },
])
//
//
total_num_rest = aggRest.toArray()[0]["count_restaurants"]
//
//
//---------------------------------
// 1.2. Group the restaurants by their cuisine style, counting how many are there per group
// 		- Sort the documents by decreasing order
// 		- Filter the documents so as to get just the first document
// 		- Use var 'total_rest' in percentage calculation
//---------------------------------
var aggRest2 = db.restaurants.aggregate([
  { "$group" : { "_id" : "$cuisine", 
                 "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 1 },
  { "$project" : { "count":1, "percentage":{ "$multiply":[{ "$divide":[100, total_num_rest]}, "$total"]}}} 
])
//
cuisine_name = aggRest2.toArray()[0]["_id"]
ratio_cuisine = aggRest2.toArray()[0]["percentage"]
print("1. The kind of cuisine with more restaurants in the city is", cuisine, "(with a", ratio_cuisine, "percentage of restaurants of the city)")
//
//
//---------------------------------
// 2. Which area represents the biggest market opportunity for opening a new restaurant of
//    this kind of cuisine? 
//---------------------------------
//
db.restaurants.aggregate([
  { "$group" : { "_id" : {"col" : "$cuisine", "bor" : "$borough"}, 
                 "total" : { "$sum" : 1 } } },
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
//*********************************
//  2. Returns the name of the borough with smaller percentage of restaurants of this kind of cuisine
//*********************************
//
//---------------------------------
// 2.1. Group the restaurants by their borough, with acount of each
// 		- Sort the documents by increasing order
//		- skip the first borough named 'missing'
// 		- Filter the documents so as to get just the first relevant document
// 		- Use var 'total_rest' in percentage calculation
//---------------------------------
//
var aggBoro1 = db.restaurants.aggregate([
  { "$group" : { "_id" : "$borough", 
                 "count" : { "$sum" : 1 } } },
  { "$sort" : { "count" : 1 } },
  { "$skip" : 1 },
  { "$limit" : 1 },
]) 
//
count_rest_borough = aggBoro1.toArray()[0]["count"];
//
//
//---------------------------------
// 2.2. Group the restaurants by their borough, with a count of the favoirite cuisine (returned from Q1)
// 		- Sort the documents by increasing order
//		- skip the first borough, as it's an outlier named 'Missing'
// 		- Filter the documents so as to get just the first relevant document
// 		- Use var 'ratio_borough' as our percentage calculation
//---------------------------------
var aggBoro2 = db.restaurants.aggregate([
  { "$project" : { "_id" : 0, 
                   "Borough" : "$borough", 
                   "Cuisine" : {"$cond" : [ {"$eq" : ["$cuisine", cuisine_name ] }, 1, 0]} } },
  { "$group" : { "_id" : "$Borough", "count" : { "$sum" : "$Cuisine" } } },
  { "$sort" : { "count" : 1 } },
  { "$skip" : 1 },
  { "$limit" : 1 },
  { "$project": {"count":1,"percentage":{"$multiply":[{"$divide":[100, count_rest_borough]},"$count"]}}} 
]) 
//
borough = aggBoro2.toArray()[0]["_id"];
//
ratio_borough = aggBoro2.toArray()[0]["percentage"];
//
//
print("1. The kind of cuisine with more restaurants in the city is", cuisine_name, "(with a", ratio_cuisine, "percentage of restaurants of the city)")
//
//
print ("2. The borough with smaller ratio of restaurants of this kind of cuisine is", borough, "(with a", ratio_borough, "percentage of restaurants of this kind)")
//
//
//*********************************
//  3. Zip Code
//*********************************
//
//
//---------------------------------
// 3.1. Get the biggest five zipcodes of the borough
//---------------------------------
db.restaurants.aggregate([
  { "$group" : { "_id" : 
                 "$address.zipcode", 
                 "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 5},
])
// { "_id" : "10003", "total" : 686 }
// { "_id" : "10019", "total" : 675 }
// { "_id" : "10036", "total" : 611 }
// { "_id" : "10001", "total" : 520 }
// { "_id" : "10022", "total" : 485 }
//
//
// Sanity check: Find zipcode with a total of 2, and print that zipcode 
// db.restaurants.aggregate([
//   { "$group" : { "_id" : "$address.zipcode", "total" : { "$sum" : 1 } } },
//   { "$sort" : { "total" : 1 } },
//   { "$skip" : 20 },
//   { "$limit" : 1},
// ])
// db.restaurants.aggregate([
//   { $match : { "address.zipcode" : "11001" } },
//   { "$sort" : { "cusine" : -1 } },
// ]).pretty()
//
//
//---------------------------------
// 3.2. Get how many zipcodes of the borough include restaurants of the kind of cuisine we are looking for
//---------------------------------

db.restaurants.aggregate([
  {"$match" : {"cuisine" : cuisine_name, "borough" : borough}},
  {"$group" : {"_id" : {"cuisine" : "$cuisine", "borough" : "$borough", "zip" : "$address.zipcode"}}},
  {"$sort" : { "_id" : -1 } },
  { "$limit" : 5},
])



db.restaurants.aggregate([
  {"$match" : {"cuisine" : cuisine_name, "borough" : borough}},
  {"$group" : {"_id" : {"cuisine" : "$cuisine", "borough" : "$borough", "zip" : "$address.zipcode"}, "count":{"$sum":1}}},
  {"$sort" : { "count" : -1 } },
  {"$limit" : 5},
])


db.restaurants.aggregate([
  {"$match" : {"address.zipcode" : "10310", "cuisine" : cuisine_name, "borough" : borough}},
  {"$group" : {"_id" : {"cuisine" : "$cuisine", "borough" : "$borough", "zip" : "$address.zipcode"}, "count":{"$sum":1}}},
])


db.restaurants.aggregate([
  {"$match" : {"address.zipcode" : "10310"}}
]).pretty()













